using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOS;
using API.Entities;
using API.Extensions;
using AutoMapper;

namespace API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<AppUser,MemberDto>()
            .ForMember(dest => dest.photoUrl,opt =>opt.MapFrom(src => 
            src.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(dest => dest.Age,opt => opt.MapFrom(src => src.DateOfBirth.calAge()));
            CreateMap<Photo,PhotoDto>();
            CreateMap<MemberUpdateDTO,AppUser>();
            CreateMap<RegisterDTO,AppUser>();
            CreateMap<Message,MessageDTO>()
            .ForMember(dest => dest.SenderPhotoUrl,opt => opt.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url))
            .ForMember(dest => dest.ReciepientPhotoUrl,opt => opt.MapFrom(src => src.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<DateTime,DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d,DateTimeKind.Utc));
        }

    }
}