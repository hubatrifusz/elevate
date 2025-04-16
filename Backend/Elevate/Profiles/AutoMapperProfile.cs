using AutoMapper;
using Elevate.Common.Utilities;
using Elevate.Models.Challenge;
using Elevate.Models.Friendship;
using Elevate.Models.Habit;
using Elevate.Models.HabitLog;
using Elevate.Models.NegativeHabit;
using Elevate.Models.Post;
using Elevate.Models.User;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<DateTime, DateTime>().ConvertUsing(src => 
            src.Kind != DateTimeKind.Utc ? DateTime.SpecifyKind(src, DateTimeKind.Utc) : src);
        
        CreateMap<DateTime?, DateTime?>().ConvertUsing(src => 
            src.HasValue && src.Value.Kind != DateTimeKind.Utc ? 
            DateTime.SpecifyKind(src.Value, DateTimeKind.Utc) : src);

        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.ProfilePictureBase64, opt => opt
            .MapFrom(src =>
                src.ProfilePicture != null && src.ProfilePicture.Length > 0 ?
                Convert.ToBase64String(src.ProfilePicture) : null
            ));

        CreateMap<UserCreateDto, ApplicationUser>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore());
            
        CreateMap<UserUpdateDto, ApplicationUser>()
            .ForMember(dest => dest.ProfilePicture, opt => opt
            .MapFrom(src =>
                !string.IsNullOrEmpty(src.ProfilePictureBase64) ? 
                Convert.FromBase64String(src.ProfilePictureBase64) : null
            ));
            
        CreateMap<UserDto, ApplicationUser>();

        CreateMap<FriendshipModel, FriendshipDto>();

        CreateMap<FriendshipCreateDto, FriendshipModel>();

        CreateMap<FriendshipUpdateDto, FriendshipModel>()
            .ForAllMembers(opts => opts
            .Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<HabitModel, HabitDto>();

        CreateMap<HabitCreateDto, HabitModel>();

        CreateMap<HabitUpdateDto, HabitModel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
            
        CreateMap<HabitDto, HabitModel>();

        CreateMap<HabitLogModel, HabitLogDto>();
            
        CreateMap<HabitLogCreateDto, HabitLogModel>();

        CreateMap<HabitLogUpdateDto, HabitLogModel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

        CreateMap<HabitLogDto, HabitLogModel>();

        CreateMap<ChallengeModel, ChallengeDto>();

        CreateMap<ChallengeCreateDto, ChallengeModel>();

        CreateMap<ChallengeUpdateDto, ChallengeModel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));
        
        CreateMap<ChallengeDto, ChallengeModel>();

        CreateMap<PostModel, PostDto>();

        CreateMap<NegativeHabitModel, NegativeHabitDto>();
        CreateMap<NegativeHabitCreateDto, NegativeHabitModel>();
    }
}