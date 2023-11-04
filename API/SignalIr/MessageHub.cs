using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalIr
{
    public class MessageHub : Hub
    {
        private readonly IMapper _mapper;
      
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly presenceTracker _tracker;
        private readonly IUnitOfWork _unitOfWork;

        public MessageHub(IMapper mapper,
        IHubContext<PresenceHub> presenceHub,
        presenceTracker tracker,IUnitOfWork unitOfWork)
        {
            _presenceHub = presenceHub;
            _tracker = tracker;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User.GetUserName(),otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId,groupName);
            var group =  await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdateGroup",group);
            var message = await _unitOfWork.messageRepository
                                .GetMessageThread(Context.User.GetUserName(),otherUser);
            if(_unitOfWork.HasChanges()){
               await _unitOfWork.Complete();
            }                    
            await Clients.Caller.SendAsync("ReciveMessageThread",message);
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var group = await RemoveFromMessageGroup(Context.ConnectionId);
            await Clients.Group(group.Name).SendAsync("UpdateGroup",group);
            await base.OnDisconnectedAsync(exception);
        }
        public async Task SendMessage(CreateMessage createMessageDto){
             var username = Context.User.GetUserName();
            if(username == createMessageDto.ReciepientUsername.ToLower())
               throw new HubException("you cannot send messaged to yourshelf");
            var sender = await _unitOfWork.userRepository.GetUserByUsername(username);
            var recipient = await _unitOfWork.userRepository.GetUserByUsername(createMessageDto.ReciepientUsername.ToLower());
            if(recipient == null) throw new HubException("Not found user");
            var message = new Message{
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
             var groupName = GetGroupName(sender.UserName,recipient.UserName);
             var group = await _unitOfWork.messageRepository.GetMessageGroup(groupName);
             if(group.Connections.Any(x => x.Username == recipient.UserName))
             {
                message.DateRead = DateTime.UtcNow;
             }
             else{
                var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
                if(connections !=null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageRecieved",
                            new {username = sender.UserName,knownAs=sender.KnownAs});
                }
             }
            _unitOfWork.messageRepository.AddMessage(message);
            // var connection = await _unitOfWork.messageRepository.GetConnection("lisa-ramos");
            //  _unitOfWork.messageRepository.RemoveConnection(connection);
            if(await _unitOfWork.Complete()) 
              {
               
                await Clients.Group(groupName).SendAsync("NewMessage",_mapper.Map<MessageDTO>(message));
              }
              
        
        }
        private async Task<Group> AddToGroup(string groupName){
             var group = await _unitOfWork.messageRepository.GetMessageGroup(groupName);
             var connection = new Connection(Context.ConnectionId,Context.User.GetUserName());
             if(group == null)
             {
                group = new Group(groupName);
                _unitOfWork.messageRepository.AddGroup(group);
             }
             group.Connections.Add(connection);
             if(await _unitOfWork.Complete()) return group;
             throw new HubException("Failed to join group");
        }
        private async Task<Group> RemoveFromMessageGroup(string connectionId)
        {
            var group = await _unitOfWork.messageRepository.GetGroupForConnection(connectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _unitOfWork.messageRepository.RemoveConnection(connection);
           if(await _unitOfWork.Complete()) return group;
           throw new HubException("Failed to remove from group");
        }
        private string GetGroupName(string caller,string other){
            var stringCompare = string.CompareOrdinal(caller,other) <0; 
            return stringCompare ? $"{caller}-{other}":$"{other}-{caller}";
        }
    }
}