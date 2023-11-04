using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.DTOS;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenservice;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager,SignInManager<AppUser> signInManager,ITokenService tokenservice,IMapper mapper){
            
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenservice = tokenservice;
            _mapper = mapper;
        }
       [HttpPost("register")]
       public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO){
        if(await UserExists(registerDTO.username)) return BadRequest("UserName already Taken");
        var user = _mapper.Map<AppUser>(registerDTO);

       
        user.UserName = registerDTO.username.ToLower();
       
       var result = await _userManager.CreateAsync(user,registerDTO.password);
       if(!result.Succeeded) return BadRequest(result.Errors);

        var roleResult = await _userManager.AddToRoleAsync(user,"Member");
        if(!roleResult.Succeeded) return BadRequest(result.Errors);
        return new UserDTO{
             username = registerDTO.username,
            Token = await _tokenservice.CreateToken(user),
            gender = user.Gender
        };
       }

       [HttpPost("login")]
       public async Task<ActionResult<UserDTO>> Login(LoginDTO logindto){
        var user = await _userManager.Users
        .Include(x =>x.Photos)
        .SingleOrDefaultAsync(x => x.UserName == logindto.username.ToLower());
        if(user == null) return Unauthorized("Username doesnot exists");
       var result = await _signInManager.CheckPasswordSignInAsync(user,logindto.password,false);
       if(!result.Succeeded) return Unauthorized();
        
         return new UserDTO{
            username = user.UserName,
            Token = await _tokenservice.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x =>x.IsMain)?.Url,
            gender = user.Gender
        };
       }

        private async Task<bool> UserExists(String username)
        {
           return  await _userManager.Users.AnyAsync(x =>x.UserName == username.ToLower());
        }
    }
}