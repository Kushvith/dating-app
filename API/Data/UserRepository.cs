using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public UserRepository(DataContext context,IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDto> GetMemberAsync(string username)
        {
            return await _context.Users.Where(x  => x.UserName == username)
            .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query=   _context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUser);
            query = query.Where(u=>u.Gender == userParams.Gender);
            var mindob = DateTime.Today.AddYears(-userParams.MinAge);
            var maxdob = DateTime.Today.AddYears(-userParams.MaxAge -1);
            query = query.Where(u=> u.DateOfBirth <= mindob && u.DateOfBirth >= maxdob);
            query = userParams.orderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            return await PagedList<MemberDto>.createAsync(query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .AsNoTracking(),userParams.PageNumber,userParams.PageSize);
        }

        public async Task<AppUser> GetuserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUsername(string username)
        {
            return await _context.Users.Include(p=>p.Photos).SingleOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            // without using map function
        //    return await _context.users
        //    .Include(p => p.Photos)
        //    .Select(x =>new MemberDto{
        //     Id = x.Id,
        //     Age = x.GetAge(),
        //     City = x.City,
        //     Country = x.Country,
        //     Created = x.Created,
        //     Interests= x.Interests,
        //     Gender = x.Gender,
        //     Introduction = x.Introduction,
        //     KnownAs = x.KnownAs,
        //     Photos = (ICollection<PhotoDto>)x.Photos.Select(p => new PhotoDto{
        //         Id = p.Id,
        //         IsMain = p.IsMain,
        //         PublicId = p.PublicId,
        //         Url = p.Url
        //     })


        //    })
        //    .ToListAsync();
        return await _context.Users
        .Include(p=>p.Photos)
        .ToListAsync();
     
        }

       
        public void update(AppUser user)
        {
           _context.Entry(user).State = EntityState.Modified;
        }

        
    }
}