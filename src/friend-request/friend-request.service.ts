import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FriendRequest } from './friend-request.model';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRequestStatus } from './enum';
import { AssociatedUser } from 'src/user/associated-user.model';
import { CreateFriendRequestDto } from './dto/input';
import { UserService } from 'src/user/user.service';
import { PopulatedUserDetail } from 'src/shared/dto';
import { populatedUserProjection } from 'src/shared/constants';
import { FriendRequestResponse } from './dto/objects';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectModel(FriendRequest.name)
    private readonly friendRequestModel: Model<FriendRequest>,
    @InjectModel(AssociatedUser.name)
    private readonly associatedUserModel: Model<AssociatedUser>,
    private readonly userService: UserService,
  ) {}

  async populateFriendRequest(id: string): Promise<FriendRequestResponse> {
    const populatedFriendRequest = await this.friendRequestModel
      .findById(id)
      .populate('senderId', populatedUserProjection)
      .populate('receiverId', populatedUserProjection);

    // Transform the result
    const transformedRequest = {
      _id: populatedFriendRequest?._id,
      sender: populatedFriendRequest?.senderId,
      receiver: populatedFriendRequest?.receiverId,
      status: populatedFriendRequest?.status,
      createdAt: populatedFriendRequest?.createdAt,
      updatedAt: populatedFriendRequest?.updatedAt,
    };
    return transformedRequest as unknown as FriendRequestResponse;
  }

  async create(
    { receiverId }: CreateFriendRequestDto,
    senderId: string,
  ): Promise<FriendRequestResponse> {
    if (senderId === receiverId) {
      throw new BadRequestException(
        'You cannot send friend request to yourself',
      );
    }
    const reciever = await this.userService.findOne(receiverId);
    if (!reciever) {
      throw new NotFoundException('Reciever not found');
    }

    const existingRequest = await this.friendRequestModel
      .findOne({
        $or: [
          {
            senderId: senderId,
            receiverId: receiverId,
          },
          {
            senderId: receiverId,
            receiverId: senderId,
          },
        ],
      })
      .lean();

    if (
      existingRequest &&
      existingRequest.status === FriendRequestStatus.ACCEPTED
    ) {
      throw new BadRequestException('Friend already exists');
    }

    if (
      existingRequest &&
      existingRequest.status === FriendRequestStatus.PENDING
    ) {
      throw new BadRequestException('Friend request already exists');
    }

    if (
      existingRequest &&
      existingRequest.status === FriendRequestStatus.REJECTED
    ) {
      await this.friendRequestModel.findByIdAndUpdate(
        existingRequest._id,
        { status: FriendRequestStatus.PENDING },
        { new: true },
      );
      return await this.populateFriendRequest(existingRequest._id.toString());
    }

    const friendRequestResult = await this.friendRequestModel.create({
      senderId,
      receiverId,
    });
    this.createAssociatedFriends(senderId, receiverId);
    return await this.populateFriendRequest(friendRequestResult._id.toString());
  }

  async createAssociatedFriends(senderId: string, receiverId: string) {
    const [senderAssociation, receiverAssociation] = await Promise.all([
      this.associatedUserModel.findOne({ userId: senderId }).lean(),
      this.associatedUserModel.findOne({ userId: receiverId }).lean(),
    ]);

    if (!senderAssociation) {
      await this.associatedUserModel.create({ userId: senderId, friends: [] });
    }

    if (!receiverAssociation) {
      await this.associatedUserModel.create({
        userId: receiverId,
        friends: [],
      });
    }
  }

  async updateStatus(
    senderId: string,
    receiverId: string,
    status: FriendRequestStatus,
  ): Promise<FriendRequestStatus> {
    if (receiverId === senderId) {
      throw new BadRequestException('You cannot update status for yourself');
    }

    const result = await this.friendRequestModel
      .findOneAndUpdate(
        { receiverId, senderId, status: { $ne: FriendRequestStatus.ACCEPTED } },
        { status },
        { new: true },
      )
      .lean();

    if (!result) {
      throw new NotFoundException('Friend request not found');
    }

    if (result.status === FriendRequestStatus.ACCEPTED) {
      const isAssociatedUserFriendRequestExists = await this.friendRequestModel
        .findOne({
          senderId: result.receiverId,
          receiverId: result.senderId,
          status: { $ne: FriendRequestStatus.ACCEPTED },
        })
        .lean();
      if (isAssociatedUserFriendRequestExists) {
        await this.friendRequestModel.findByIdAndUpdate(
          isAssociatedUserFriendRequestExists._id,
          { status: FriendRequestStatus.ACCEPTED },
        );
      }
      await this.associatedUserModel.findOneAndUpdate(
        { userId: result.receiverId },
        { $addToSet: { friends: result.senderId } },
      );
      await this.associatedUserModel.findOneAndUpdate(
        { userId: result.senderId },
        { $addToSet: { friends: result.receiverId } },
      );
    }

    if (result.status === FriendRequestStatus.REJECTED) {
      await this.associatedUserModel.findOneAndUpdate(
        { userId: result.receiverId },
        { $pull: { friends: result.senderId } },
      );
      await this.associatedUserModel.findOneAndUpdate(
        { userId: result.senderId },
        { $pull: { friends: result.receiverId } },
      );
    }
    return result.status;
  }

  async findAll(userId: string): Promise<FriendRequestResponse[]> {
    const result = await this.friendRequestModel
      .find({
        receiverId: userId,
        status: FriendRequestStatus.PENDING,
      })
      .populate('senderId', populatedUserProjection)
      .populate('receiverId', populatedUserProjection);

    const transformedResult = result.map((item) => ({
      _id: item._id,
      sender: item.senderId,
      receiver: item.receiverId,
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    })) as unknown as FriendRequestResponse[];

    return transformedResult;
  }

  async findPublicFriends(userId: string): Promise<PopulatedUserDetail[]> {
    const associatedUser = await this.associatedUserModel
      .findOne({ userId })
      .select({ friends: 1, _id: 0 });

    const publicFriends = await this.userService.findMany(
      {
        $and: [
          {
            _id: { $nin: associatedUser?.friends },
          },
          {
            _id: { $ne: userId },
          },
        ],
      },
      { select: populatedUserProjection },
    );

    return publicFriends as unknown as PopulatedUserDetail[];
  }

  async findAllFriends(userId: string): Promise<PopulatedUserDetail[]> {
    const associatedUser = await this.associatedUserModel
      .findOne({ userId })
      .select({ friends: 1, _id: 0 });

    const friends = await this.userService.findMany(
      { _id: { $in: associatedUser?.friends } },
      { select: populatedUserProjection },
    );

    return friends as unknown as PopulatedUserDetail[];
  }
}
