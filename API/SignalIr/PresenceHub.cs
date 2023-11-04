using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalIr
{   [Authorize]
    public class PresenceHub :Hub
    {
        private readonly presenceTracker _tracker;

        public PresenceHub(presenceTracker tracker)
        {
            _tracker = tracker;
        }

        public override async Task OnConnectedAsync()
        {
            var online = await _tracker.UserConnected(Context.User.GetUserName(),Context.ConnectionId);
            if(online)
                await Clients.Others.SendAsync("UserIsOnline",Context.User.GetUserName());

            var currentUsers = await _tracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers",currentUsers);
        }
        public override async Task OnDisconnectedAsync(Exception exception){
           var offline = await _tracker.UserDisconnected(Context.User.GetUserName(),Context.ConnectionId);
            if(offline)
                await Clients.Others.SendAsync("UserIsOffline",Context.User.GetUserName());
            await base.OnDisconnectedAsync(exception);
        }
    }
}