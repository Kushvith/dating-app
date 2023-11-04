using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikeRepository
    {
        Task<UserLikeEntity> GetUserLike(int sourceuserid,
        int likeduserid);
         Task<AppUser> GetUserWithLikes(int userId);
        Task<PagedList<likeDto>> GetUserLikes(Likeparams likeparams);
    }
}