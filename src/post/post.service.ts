import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  CommentDto,
  CreatePostDto,
  DeleteCommentDto,
  LikeDto,
  PostQueryDto,
  UpdateCommentDto,
  UpdatePostDto,
} from './dto/input';
import { Model } from 'mongoose';
import { Comment, Post } from './post.model';
import { ObjectId } from 'src/shared/utils/objectId';
import { LikeStatus, PostFetchType } from './enum';
import {
  PostCommentResponse,
  PostUpdateResponse,
  PostWithCreatedByUserDetail,
  PostWithLikesAndComments,
  UpdateCommentResponse,
} from './dto/objects';
import {
  messages,
  postAllProjection,
  postProjection,
  postUserProjection,
} from './constants';
import { AssociatedUser } from 'src/user/associated-user.model';
import { UserService } from 'src/user/user.service';
import { removeDuplicates } from 'src/shared/utils/array';
import { PostMapper } from './post.mapper';
import { getPagination } from 'src/shared/utils/pagination';
import { PopulatedUserDetail } from 'src/shared/dto';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<Post>,
    @InjectModel(AssociatedUser.name)
    private readonly associatedUserModel: Model<AssociatedUser>,
    private readonly userService: UserService,
    private readonly postMapper: PostMapper,
  ) {}

  // POST
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<Post> {
    const payload = { ...createPostDto, createdBy: ObjectId(userId) };
    const post = await this.postModel.create(payload);
    return post;
  }

  async findAllPosts(
    userId: string,
    queryDto?: PostQueryDto,
  ): Promise<PostWithCreatedByUserDetail[]> {
    let posts: Post[] = [];
    const type = queryDto?.type as PostFetchType;
    const { limit, skip } = getPagination(queryDto);
    const { query, friendIds } = await this.getPostsQueries(userId, type);

    if (!friendIds.length && type === PostFetchType.FRIENDS) {
      posts = [];
    } else {
      posts = await this.postModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select(postProjection)
        .lean();
    }

    const createdByUsers = await this.getPostCreatedByUsers(posts);

    const postsWithUser = this.postMapper.mapPostToPostWithCreatedByUserDetail(
      posts,
      createdByUsers,
    );

    return postsWithUser;
  }

  async findPostById(postId: string): Promise<PostWithLikesAndComments> {
    const post = await this.postModel
      .findById(postId)
      .select(postAllProjection)
      .populate('createdBy', postUserProjection)
      .lean();
    if (!post) {
      throw new BadRequestException(messages.POST_NOT_FOUND);
    }

    const commentUsers = await this.getPostCommentsCreatedByUsers(post);

    const result = this.postMapper.mapPostToPostWithLikesAndComments(
      post,
      commentUsers,
    );

    return result;
  }

  async findAllPostsCount(
    userId: string,
    type?: PostFetchType,
  ): Promise<number> {
    let count = 0;
    const { query, friendIds } = await this.getPostsQueries(
      userId,
      type || PostFetchType.USER,
    );

    if (type === PostFetchType.FRIENDS && !friendIds.length) {
      count = 0;
    } else {
      count = await this.postModel.countDocuments(query);
    }
    return count;
  }

  async updatePost(
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<PostUpdateResponse> {
    const postId = updatePostDto.postId;
    const payload = {
      ...(updatePostDto.contents && { contents: updatePostDto.contents }),
      ...(updatePostDto.imageUrl && { imageUrl: updatePostDto.imageUrl }),
    };

    if (Object.keys(payload).length === 0) {
      throw new BadRequestException(messages.NO_VALID_FIELDS_TO_UPDATE);
    }

    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, createdBy: userId },
      payload,
      {
        new: true,
      },
    );
    if (!post) {
      throw new BadRequestException(messages.POST_NOT_FOUND);
    }
    return post;
  }

  async deletePost(postId: string, userId: string): Promise<string> {
    const post = await this.postModel.findOneAndDelete({
      _id: postId,
      createdBy: userId,
    });
    if (!post) {
      throw new BadRequestException(messages.POST_NOT_FOUND);
    }
    return postId;
  }

  // POST COMMENT
  async createPostComment(
    commentDto: CommentDto,
    userId: string,
  ): Promise<PostCommentResponse> {
    const postId = commentDto.postId;
    const payload = {
      contents: commentDto.contents,
      createdBy: ObjectId(userId),
    };
    const post = await this.postModel
      .findByIdAndUpdate(
        postId,
        { $push: { comments: payload } },
        { new: true },
      )
      .lean();

    if (!post) {
      throw new BadRequestException(messages.POST_NOT_FOUND);
    }
    const comment = post.comments[post.comments.length - 1];

    const commentUser = await this.getPostCommentCreatedByUser(comment);

    const result = this.postMapper.mapPostComment(comment, commentUser);
    return result;
  }

  async updatePostComment(
    commentDto: UpdateCommentDto,
    userId: string,
  ): Promise<UpdateCommentResponse> {
    const { commentId, postId, contents } = commentDto;

    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, 'comments._id': commentId, 'comments.createdBy': userId },
      { $set: { 'comments.$.contents': contents } },
      { new: true },
    );
    if (!post) {
      throw new BadRequestException(messages.COMMENT_NOT_FOUND);
    }
    const updatedCommentContents =
      post.comments.find((comment) => comment?._id?.equals(commentId))
        ?.contents || '';
    return { contents: updatedCommentContents };
  }

  async deletePostComment(
    commentDto: DeleteCommentDto,
    userId: string,
  ): Promise<string> {
    const { commentId, postId } = commentDto;
    const post = await this.postModel.findOneAndUpdate(
      { _id: postId, 'comments._id': commentId, 'comments.createdBy': userId },
      { $pull: { comments: { _id: commentId } } },
      { new: true },
    );
    if (!post) {
      throw new BadRequestException(messages.COMMENT_NOT_FOUND);
    }
    return commentId;
  }

  // POST LIKE
  async likePost(likeDto: LikeDto, userId: string): Promise<LikeStatus> {
    const postId = likeDto.postId;
    const likeStatus = likeDto.likeStatus;

    const post = await this.postModel.findById(postId);
    if (!post) {
      throw new BadRequestException(messages.POST_NOT_FOUND);
    }

    const isLiked = post?.likes?.some((like) =>
      like?.createdBy?.equals(ObjectId(userId)),
    );
    if (isLiked && likeStatus === LikeStatus.LIKE) {
      throw new BadRequestException(messages.POST_ALREADY_LIKED);
    }

    if (!isLiked && likeStatus === LikeStatus.DISLIKE) {
      throw new BadRequestException(
        messages.YOU_HAVE_ALREADY_DISLIKED_THIS_POST,
      );
    }

    if (likeStatus === LikeStatus.LIKE) {
      const payload = { createdBy: ObjectId(userId) };
      await this.postModel.findByIdAndUpdate(postId, {
        $push: { likes: payload },
      });
    } else if (isLiked) {
      await this.postModel.findByIdAndUpdate(postId, {
        $pull: { likes: { createdBy: ObjectId(userId) } },
      });
    }

    return likeStatus;
  }

  // Helper functions
  async getFriendIds(userId: string): Promise<string[]> {
    const userAssociated = await this.associatedUserModel
      .findOne({ userId: ObjectId(userId) })
      .lean();
    const friendIds = [
      ...new Set(
        userAssociated?.friends?.map((friend) => friend.toString()) || [],
      ),
    ];
    return friendIds;
  }

  async getPostsQueries(userId: string, type: PostFetchType) {
    let query: any = { createdBy: userId };
    let friendIds: string[] = [];

    switch (type) {
      case PostFetchType.FRIENDS: {
        friendIds = await this.getFriendIds(userId);
        query = { createdBy: { $in: friendIds } };
        break;
      }
      case PostFetchType.ALL: {
        friendIds = await this.getFriendIds(userId);

        query = friendIds.length
          ? { $or: [{ createdBy: userId }, { createdBy: { $in: friendIds } }] }
          : { createdBy: userId };

        break;
      }

      default: {
        break;
      }
    }

    return { query, friendIds };
  }

  async getPostCreatedByUsers(posts: Post[]) {
    const createdByUserIds = removeDuplicates(
      posts.map((post) => post.createdBy.toString()),
    );

    const createdByUsers = await this.userService.findByIds(createdByUserIds, {
      select: postUserProjection,
    });

    return createdByUsers;
  }

  async getPostCommentCreatedByUser(
    comment: Comment,
  ): Promise<PopulatedUserDetail> {
    const commentUser = await this.userService.findOneById(
      comment.createdBy.toString(),
      { select: postUserProjection },
    );

    return commentUser as unknown as PopulatedUserDetail;
  }

  async getPostCommentsCreatedByUsers(post: Post) {
    const commentUserIds = removeDuplicates(
      post.comments.map((comment) => comment.createdBy?.toString()),
    );

    const commentUsers = commentUserIds
      ? await this.userService.findByIds(commentUserIds, {
          select: postUserProjection,
        })
      : [];

    return commentUsers;
  }
}
