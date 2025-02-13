using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using Elevate.Models.AchievementProgress;
using AutoMapper;
using Elevate.Models.Friendship;

namespace Elevate.Profiles
{
    public class AutoMapperProfile : AutoMapper.Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<ApplicationUser, UserDto>();
            CreateMap<UserCreateDto, ApplicationUser>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            CreateMap<UserUpdateDto, ApplicationUser>();

            CreateMap<Friendship, FriendshipDto>();
            CreateMap<FriendshipCreateDto, Friendship>();

            CreateMap<HabitModel, HabitDto>();
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