using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        
        public LikesController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
      
        }
        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username){
            var sourceuserid =  User.GetUserId();
            var likeduser = await _unitOfWork.userRepository.GetUserByUsername(username);
            var SourceUser = await _unitOfWork.likeRepository.GetUserWithLikes(sourceuserid);
            if(likeduser == null) return NotFound();
            if(SourceUser.UserName == username) return BadRequest("You cannot like yourshelf");
            var userLike = await _unitOfWork.likeRepository.GetUserLike(sourceuserid,likeduser.Id);
            if(userLike !=null) return BadRequest("you already liked this user");
            userLike = new UserLikeEntity{
                SourceUserId = sourceuserid,
                LikedUserId = likeduser.Id
            };
            SourceUser.LikedUsers.Add(userLike);
            if(await _unitOfWork.Complete()) return Ok();
            return BadRequest("something went wrong");
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<likeDto>>> GetUserLikes([FromQuery]Likeparams likeparams){
            likeparams.UserId = User.GetUserId();
        
            
            var users = await _unitOfWork.likeRepository.GetUserLikes(likeparams);
            Response.AddPaginationHeader(users.CurrentPage,users.pageSize,users.TotalCount,users.TotalPages);
            return Ok(users);
        }
    }
}