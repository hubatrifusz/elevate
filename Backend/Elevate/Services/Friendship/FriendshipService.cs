﻿using Elevate.Data.Repository;
using Elevate.Models.User;
using Elevate.Models.Friendship;
using Elevate.Common.Exceptions;
using AutoMapper;

namespace Elevate.Services.Friendship
{
    public class FriendshipService(FriendshipRepository friendshipRepository, IMapper mapper) : IFriendshipService
    {
        private readonly FriendshipRepository _friendshipRepository = friendshipRepository;
        private readonly IMapper _mapper = mapper;

        public async Task<List<UserDto>> GetFriendsAsync(Guid userId)
        {
            List<ApplicationUser> users = await _friendshipRepository.GetFriendsAsync(userId);

            return users.Count == 0
                ? throw new ResourceNotFoundException("User has no friends.")
                : _mapper.Map<List<UserDto>>(users);
        }

        public async Task<List<UserDto>> GetFriendRequestsAsync(Guid userId)
        {
            List<ApplicationUser> users = await _friendshipRepository.GetFriendRequestsAsync(userId);

            return users.Count == 0
                ? throw new ResourceNotFoundException("User has no friend requests.")
                : _mapper.Map<List<UserDto>>(users);
        }

        public async Task<List<FriendshipDto>> GetSentFriendRequestsAsync(Guid userId)
        {
            List<FriendshipModel> requests = await _friendshipRepository.GetSentFriendRequestsAsync(userId);

            return requests.Count == 0
                ? throw new ResourceNotFoundException("User sent no friend requests.")
                : _mapper.Map<List<FriendshipDto>>(requests);
        }

        public async Task<FriendshipDto> AddFriendshipAsync(FriendshipCreateDto friendshipCreateDto)
        {
            if (friendshipCreateDto.UserId == friendshipCreateDto.FriendId)
            {
                throw new BadRequestException("User cannot be friends with themself.");
            }
            if (await _friendshipRepository.IsFriendRequestSent(friendshipCreateDto.UserId, friendshipCreateDto.FriendId))
            {
                throw new BadRequestException("Friend request already sent.");
            }
            if (await _friendshipRepository.AreFriends(friendshipCreateDto.UserId, friendshipCreateDto.FriendId))
            {
                throw new BadRequestException("User is already friends with this user.");
            }
            
            FriendshipModel friendship = _mapper.Map<FriendshipModel>(friendshipCreateDto);
            
            FriendshipModel savedFriendship = await _friendshipRepository.AddFriendshipAsync(friendship)
                ?? throw new BadRequestException("Failed to add friend.");

            return _mapper.Map<FriendshipDto>(savedFriendship);
        }

        public async Task<FriendshipDto> UpdateFriendshipAsync(FriendshipUpdateDto friendshipUpdateDto)
        {
            if (!await _friendshipRepository.IsFriendRequestSent(friendshipUpdateDto.UserId, friendshipUpdateDto.FriendId))
            {
                throw new NotFriendsException();
            }

            FriendshipModel friendshipModel = _mapper.Map<FriendshipModel>(friendshipUpdateDto);

            if(friendshipModel.Status == FriendshipStatus.Declined){
                return await DeleteFriendshipAsync(friendshipUpdateDto.UserId, friendshipUpdateDto.FriendId);
            }
            else{
                FriendshipModel updatedFriendship = await _friendshipRepository.UpdateFriendshipAsync(friendshipModel)
                    ?? throw new BadRequestException("Failed to update friendship.");

                return _mapper.Map<FriendshipDto>(updatedFriendship);
            }
        }

        public async Task<FriendshipDto> DeleteFriendshipAsync(Guid userId, Guid friendId)
        {
            FriendshipModel friendship = await _friendshipRepository.DeleteFriendshipAsync(userId, friendId)
                ?? throw new ResourceNotFoundException("Failed to remove friend.");

            return _mapper.Map<FriendshipDto>(friendship);
        }
    }
}
