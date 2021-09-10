using AutoMapper;
using Domain;
using System.Linq;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles() 
        {
            CreateMap<ActivityRequest, Activity>()
                    .IgnoreAllPropertiesWithAnInaccessibleSetter();

            CreateMap<Activity, ActivityDto>()
                    .ForMember(x=>x.HostUserName, o=> o.MapFrom(s=>s.Attendees.FirstOrDefault(x=> x.IsHost).AppUser.UserName))
                    .IgnoreAllPropertiesWithAnInaccessibleSetter();

            CreateMap<ActivityAttendee, Profiles.Profile>()
                    .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                    .ForMember(d => d.UserName, o => o.MapFrom(s => s.AppUser.UserName))
                    .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio));
        }
    }
}