using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikeRepository : ILikeRepository
    {
        private readonly DataContext _context;

        public LikeRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLikeEntity> GetUserLike(int sourceuserid, int likeduserid)
        {
            return await _context.likes.FindAsync(sourceuserid,likeduserid);
        }

        public async Task<PagedList<likeDto>> GetUserLikes(Likeparams likeparams)
        {
           var users =  _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.likes.AsQueryable();
            if(likeparams.predicate == "liked"){
                likes = likes.Where(like => like.SourceUserId == likeparams.UserId);
                users = likes.Select(like => like.LikedUser);
            }
            else{
                likes = likes.Where(like => like.LikedUserId == likeparams.UserId);
                users = likes.Select(like => like.SourceUser);

            }
            var likedUser =  users.Select(user => new likeDto{
                Username = user.UserName,
                Age = user.DateOfBirth.calAge(),
                City = user.City,
                PhotoUrl = user.Photos.FirstOrDefault(photo => photo.IsMain).Url,
                KnownAs = user.KnownAs,
                id = user.Id
            });
            return await PagedList<likeDto>.createAsync(likedUser,likeparams.PageNumber,likeparams.PageSize);
        }

       

        public async Task<AppUser> GetUserWithLikes(int userId)
        {
            return await _context.Users
            .Include(u => u.LikedUsers)
            .FirstOrDefaultAsync(x => x.Id == userId);
        }
    }
}