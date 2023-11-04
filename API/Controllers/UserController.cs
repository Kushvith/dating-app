using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : BaseApiController
    {
        private readonly IUnitOfWork _unitOfWork;
        public readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UserController(IUnitOfWork unitOfWork,IMapper mapper,IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }


        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery]UserParams userParams){
            var user = await _unitOfWork.userRepository.GetUserByUsername(User.GetUserName());
            userParams.CurrentUser = user.UserName;
            if(string.IsNullOrEmpty(userParams.Gender)){
                userParams.Gender = user.Gender == "male"?"female":"male";
            }
           var users = await _unitOfWork.userRepository.GetMembersAsync(userParams);
           Response.AddPaginationHeader(users.CurrentPage,users.pageSize,users.TotalCount,users.TotalPages);
           return Ok(users);
        }
        [HttpGet("{username}",Name ="GetUser")]
        public async Task<ActionResult<MemberDto>> GetUser(String username){
           return await _unitOfWork.userRepository.GetMemberAsync(username);
        }
        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDTO){
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _unitOfWork.userRepository.GetUserByUsername(username);
            _mapper.Map(memberUpdateDTO,user);
            _unitOfWork.userRepository.update(user);
            if(await _unitOfWork.Complete()) return NoContent();
            return BadRequest("failed to update Profile");
        }
        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file){
            var user = await _unitOfWork.userRepository.GetUserByUsername(User.GetUserName());
            var result = await _photoService.AddPhotoAsync(file);
            if(result.Error !=null) return BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if(user.Photos.Count == 0){
                photo.IsMain = true;
            }
            user.Photos.Add(photo);
            if(await _unitOfWork.Complete()){
                return CreatedAtRoute("GetUser",new {username = user.UserName},_mapper.Map<PhotoDto>(photo));
            }
            // return _mapper.Map<PhotoDto>(photo);
            return BadRequest("Something went wrong while Adding Image");
        }
        [HttpPut("set-main/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId){
            var user = await _unitOfWork.userRepository.GetUserByUsername(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo.IsMain) return BadRequest("This is already your main photo");
            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            if(currentMain!=null) currentMain.IsMain = false;
            photo.IsMain = true;
            
            if(await _unitOfWork.Complete()) return NoContent();
            return BadRequest("Failed to set main photo");
        }
        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> deletePhoto(int photoId){
            var user = await _unitOfWork.userRepository.GetUserByUsername(User.GetUserName());
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if(photo == null) return NotFound();
            if(photo.IsMain) return BadRequest("You cannot delete your main photo");
            if(photo.PublicId !=null){
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error!=null) return BadRequest(result.Error.Message);

            }
            user.Photos.Remove(photo);
            if(await _unitOfWork.Complete()) return Ok();
            return BadRequest("something went wrong");
        }
    }
}