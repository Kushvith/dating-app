using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void update(AppUser user);


        Task<IEnumerable<AppUser>> GetUsersAsync();

        Task<AppUser> GetuserByIdAsync(int id);
        Task<AppUser> GetUserByUsername(String username);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberAsync(string username);
        
    }
}