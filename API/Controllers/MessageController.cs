using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MessageController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public MessageController(IUnitOfWork unitOfWork,IMapper mapper)
        {
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }
        [HttpPost]
        public async Task<ActionResult<MessageDTO>> CreateMessage(CreateMessage createMessageDto){
            var username = User.GetUserName();
            if(username == createMessageDto.ReciepientUsername.ToLower())
                return BadRequest("you cannot send messaged to yourshelf");
            var sender = await _unitOfWork.userRepository.GetUserByUsername(username);
            var recipient = await _unitOfWork.userRepository.GetUserByUsername(createMessageDto.ReciepientUsername.ToLower());
            if(recipient == null) return NotFound();
            var message = new Message{
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };
            _unitOfWork.messageRepository.AddMessage(message);
            if(await _unitOfWork.Complete()) 
                return Ok(_mapper.Map<MessageDTO>(message));
            return BadRequest("something went wrong");    
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetMessagesForUser([FromQuery]MessageParams messageParams){
            messageParams.Username = User.GetUserName();
            var messages = await _unitOfWork.messageRepository.GetMessagesForUser(messageParams);
            Response.AddPaginationHeader(messages.CurrentPage,messages.pageSize,messages.TotalCount,messages.TotalPages);
           
         return messages;
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id){
            var username = User.GetUserName();
            var message = await _unitOfWork.messageRepository.GetMessage(id);
            if(message.Sender.UserName != username && message.Recipient.UserName !=username)
            return Unauthorized();
            if(message.Sender.UserName == username) message.SenderDeleted = true;
            if(message.Recipient.UserName == username) message.RecipientDeleted = true;
            if(message.SenderDeleted && message.RecipientDeleted) _unitOfWork.messageRepository.DeleteMessage(message);
            if(await _unitOfWork.Complete()) return Ok();
            return BadRequest("something went wrong");
        }
    }
}