import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { AccountResponse, CreateUserDto, UserResponse } from './dto';
import { FindOptions } from 'src/shared/interfaces';
import { AssociatedUser } from './associated-user.model';
import { populatedUserProjection } from 'src/shared/constants';
import { PaginationQueryDto, PopulatedUserDetail } from 'src/shared/dto';
import { getPagination } from 'src/shared/utils/pagination';
import { PostService } from 'src/post/post.service';
import { forwardRef } from '@nestjs/common';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(AssociatedUser.name)
    private readonly associatedUserModel: Model<AssociatedUser>,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async findAll(query: PaginationQueryDto): Promise<UserResponse> {
    const { limit, skip } = getPagination(query);
    const response = await this.userModel.aggregate([
      {
        $match: { isActive: true },
      },
      {
        $facet: {
          rows: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $project: populatedUserProjection,
            },
          ],
          count: [
            {
              $count: 'total',
            },
          ],
        },
      },
    ]);

    return {
      rows: response[0].rows as PopulatedUserDetail[],
      total: response[0].count[0].total,
    };
  }

  async findOneById(id: string, options?: FindOptions): Promise<User | null> {
    return await this.userModel
      .findOne({ _id: id, isActive: true })
      .select(options?.select || {})
      .lean();
  }
  async findOne(id: string, options?: FindOptions): Promise<User | null> {
    return await this.userModel
      .findOne({ _id: id, isActive: true })
      .select(options?.select || {})
      .lean();
  }

  async findByIds(ids: string[], options?: FindOptions): Promise<User[]> {
    return await this.userModel
      .find({ _id: { $in: ids }, isActive: true })
      .select(options?.select || {})
      .sort(options?.sort || {})
      .lean();
  }

  async findMany(query: any, options?: FindOptions): Promise<User[]> {
    return await this.userModel
      .find({ ...query, isActive: true })
      .select(options?.select || {})
      .sort(options?.sort || {})
      .lean();
  }

  async create(user: CreateUserDto) {
    const newUser = await this.userModel.create(user);
    return newUser;
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email, isActive: true }).lean();
  }

  async getFriendIds(userId: string): Promise<string[]> {
    const userAssociated = await this.associatedUserModel
      .findOne({ userId })
      .lean();
    const friendIds = [
      ...new Set(
        userAssociated?.friends?.map((friend) => friend.toString()) || [],
      ),
    ];
    return friendIds;
  }

  async deactivateAccount(email: string): Promise<AccountResponse> {
    const user = await this.userModel.findOneAndUpdate(
      { email, isActive: true },
      {
        isActive: false,
      },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.postService.handleVisibilityOfPostCommentLikeCreatedByUser(
      user._id.toString(),
      false,
    );

    return {
      _id: user._id.toString(),
      email: user.email,
    };
  }

  async activateAccount(email: string): Promise<AccountResponse> {
    const user = await this.userModel.findOneAndUpdate(
      { email, isActive: false },
      {
        isActive: true,
      },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }
    this.postService.handleVisibilityOfPostCommentLikeCreatedByUser(
      user._id.toString(),
      true,
    );
    return {
      _id: user._id.toString(),
      email: user.email,
    };
  }
}
