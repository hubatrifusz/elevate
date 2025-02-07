using Elevate.Models.Achievement;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.User;
using Elevate.Models.AchievementProgress;

namespace Elevate.Profiles
{
    public class AutoMapperProfile : AutoMapper.Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<UserModel, UserDto>();
            CreateMap<UserCreateDto, UserModel>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());

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
