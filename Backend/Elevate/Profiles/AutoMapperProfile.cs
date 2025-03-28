public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<DateTime, DateTime>().ConvertUsing(src => src.Kind == DateTimeKind.Utc ? src.UtcToCetTime() : src);

        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.ProfilePictureBase64, opt => opt.MapFrom(src =>
                src.ProfilePicture != null && src.ProfilePicture.Length > 0 ?
                Convert.ToBase64String(src.ProfilePicture) : null
            ))
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.UtcToCetTime()));
            
        CreateMap<UserCreateDto, ApplicationUser>()
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.CreatedAt)));
            
        CreateMap<UserUpdateDto, ApplicationUser>()
            .ForMember(dest => dest.ProfilePicture, opt => opt.MapFrom(src =>
                !string.IsNullOrEmpty(src.ProfilePictureBase64) ? 
                Convert.FromBase64String(src.ProfilePictureBase64) : null
            ));
            
        CreateMap<UserDto, ApplicationUser>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.CreatedAt)));

        CreateMap<FriendshipModel, FriendshipDto>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.UtcToCetTime()))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.UtcToCetTime() : (DateTime?)null));
            
        CreateMap<FriendshipCreateDto, FriendshipModel>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.CreatedAt)));
            
        CreateMap<FriendshipUpdateDto, FriendshipModel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? DateTimeConverter.CetToUtcTime(src.UpdatedAt.Value) : (DateTime?)null));

        CreateMap<HabitModel, HabitDto>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.UtcToCetTime()))
            .ForMember(dest => dest.StreakStart, opt => opt.MapFrom(src => src.StreakStart.HasValue ? src.StreakStart.Value.UtcToCetTime() : (DateTime?)null));
            
        CreateMap<HabitCreateDto, HabitModel>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.CreatedAt)))
            .ForMember(dest => dest.StreakStart, opt => opt.MapFrom(src => src.StreakStart.HasValue ? DateTimeConverter.CetToUtcTime(src.StreakStart.Value) : (DateTime?)null));
            
        CreateMap<HabitUpdateDto, HabitModel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.StreakStart, opt => opt.MapFrom(src => src.StreakStart.HasValue ? DateTimeConverter.CetToUtcTime(src.StreakStart.Value) : (DateTime?)null));
            
        CreateMap<HabitDto, HabitModel>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.CreatedAt)))
            .ForMember(dest => dest.StreakStart, opt => opt.MapFrom(src => src.StreakStart.HasValue ? DateTimeConverter.CetToUtcTime(src.StreakStart.Value) : (DateTime?)null));

        CreateMap<HabitLogModel, HabitLogDto>()
            .ForMember(dest => dest.CompletedAt, opt => opt.MapFrom(src => src.CompletedAt.HasValue ? src.CompletedAt.Value.UtcToCetTime() : (DateTime?)null))
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => src.DueDate.UtcToCetTime()));
            
        CreateMap<HabitLogCreateDto, HabitLogModel>()
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.DueDate)))
            .ForMember(dest => dest.CompletedAt, opt => opt.MapFrom(src => src.CompletedAt.HasValue ? DateTimeConverter.CetToUtcTime(src.CompletedAt.Value) : (DateTime?)null));
            
        CreateMap<HabitLogUpdateDto, HabitLogModel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.CompletedAt, opt => opt.MapFrom(src => src.CompletedAt.HasValue ? DateTimeConverter.CetToUtcTime(src.CompletedAt.Value) : (DateTime?)null));
            
        CreateMap<HabitLogDto, HabitLogModel>()
            .ForMember(dest => dest.DueDate, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.DueDate)))
            .ForMember(dest => dest.CompletedAt, opt => opt.MapFrom(src => src.CompletedAt.HasValue ? DateTimeConverter.CetToUtcTime(src.CompletedAt.Value) : (DateTime?)null));

        CreateMap<ChallengeModel, ChallengeDto>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.UtcToCetTime()))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.UtcToCetTime() : (DateTime?)null));
            
        CreateMap<ChallengeCreateDto, ChallengeModel>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.CreatedAt)));
            
        CreateMap<ChallengeUpdateDto, ChallengeModel>()
            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? DateTimeConverter.CetToUtcTime(src.UpdatedAt.Value) : (DateTime?)null));
            
        CreateMap<ChallengeDto, ChallengeModel>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTimeConverter.CetToUtcTime(src.CreatedAt)))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? DateTimeConverter.CetToUtcTime(src.UpdatedAt.Value) : (DateTime?)null));

        CreateMap<PostModel, PostDto>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.UtcToCetTime()))
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => src.UpdatedAt.HasValue ? src.UpdatedAt.Value.UtcToCetTime() : (DateTime?)null));

        CreateMap<AchievementModel, AchievementDto>()
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => src.CreatedAt.UtcToCetTime()));
            
        CreateMap<AchievementProgressModel, AchievementProgressDto>()
            .ForMember(dest => dest.CompletedAt, opt => opt.MapFrom(src => src.CompletedAt.HasValue ? src.CompletedAt.Value.UtcToCetTime() : (DateTime?)null));
    }
}