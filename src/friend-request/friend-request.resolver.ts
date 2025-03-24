import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FriendRequestService } from './friend-request.service';
import { FriendRequest } from './friend-request.model';
import {
  CreateFriendRequestDto,
  UpdateFriendRequestStatusDto,
} from './dto/input';
import { FriendRequestStatus } from './enum';
import { LoggedInUser } from 'src/shared/decorator/logged-in-user.decorator';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from 'src/shared/guard/auth.guard';
import { TokenizedUserData } from 'src/auth/dto';
import { PopulatedUserDetail } from 'src/shared/dto';

@Resolver()
@UseGuards(GQLAuthGuard)
export class FriendRequestResolver {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Mutation(() => FriendRequest)
  createFriendRequest(
    @Args('payload') payload: CreateFriendRequestDto,
    @LoggedInUser() user: TokenizedUserData,
  ) {
    return this.friendRequestService.create(payload, user._id);
  }

  @Mutation(() => String)
  updateFriendRequestStatus(
    @Args('payload') payload: UpdateFriendRequestStatusDto,
    @LoggedInUser() user: TokenizedUserData,
  ): Promise<FriendRequestStatus> {
    const receiverId = user._id;
    return this.friendRequestService.updateStatus(
      payload.senderId,
      receiverId,
      payload.status as unknown as FriendRequestStatus,
    );
  }

  @Query(() => [FriendRequest])
  getFriendRequests(@LoggedInUser() user: TokenizedUserData) {
    return this.friendRequestService.findAll(user._id);
  }

  @Query(() => [PopulatedUserDetail])
  getPublicFriends(
    @LoggedInUser() user: TokenizedUserData,
  ): Promise<PopulatedUserDetail[]> {
    return this.friendRequestService.findPublicFriends(user._id);
  }
}
