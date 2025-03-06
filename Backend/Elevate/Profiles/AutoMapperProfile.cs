using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using Elevate.Models.AchievementProgress;
using AutoMapper;
using Elevate.Models.Friendship;

namespace Elevate.Profiles
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserDto>()
                .ForMember(dest => dest.ProfilePictureBase64, opt => opt.MapFrom(src =>
                src.ProfilePicture != null && src.ProfilePicture.Length > 0 ?
                Convert.ToBase64String(src.ProfilePicture) : null
                ));
            CreateMap<UserCreateDto, ApplicationUser>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt));
            CreateMap<UserUpdateDto, ApplicationUser>()
                .ForMember(dest => dest.ProfilePicture, opt => opt.MapFrom(src =>
                    !string.IsNullOrEmpty(src.ProfilePictureBase64) ? 
                    Convert.FromBase64String(src.ProfilePictureBase64) : null
                ));

            CreateMap<FriendshipModel, FriendshipDto>();
            CreateMap<FriendshipCreateDto, FriendshipModel>();

            CreateMap<HabitModel, HabitDto>()
                .ForMember(dest => dest.FrequencyType, opt =>
                opt.MapFrom(src => src.FrequencyType.ToString()));
            CreateMap<HabitCreateDto, HabitModel>();
            CreateMap<HabitUpdateDto, HabitModel>();

            CreateMap<HabitLogModel, HabitLogDto>();
            CreateMap<HabitLogCreateDto, HabitLogModel>();
            CreateMap<HabitLogUpdateDto, HabitLogModel>();

            CreateMap<AchievementModel, AchievementDto>();
            CreateMap<AchievementProgressModel, AchievementProgressDto>();
        }
    }
}