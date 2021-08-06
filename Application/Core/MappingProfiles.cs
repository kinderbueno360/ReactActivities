using Application.Request;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles() 
        {
            CreateMap<ActivityRequest, Activity>()
                    .IgnoreAllPropertiesWithAnInaccessibleSetter();
        }
    }
}