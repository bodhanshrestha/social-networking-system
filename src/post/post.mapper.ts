import { Injectable } from '@nestjs/common';
import {
  PostCommentResponse,
  PostWithCreatedByUserDetail,
  PostWithLikesAndComments,
} from './dto/objects';
import { Comment, Post } from './post.model';
import { User } from 'src/user/user.model';
import { PopulatedUserDetail } from 'src/shared/dto';

@Injectable()
export class PostMapper {
  constructor() {}

  mapPostToPostWithCreatedByUserDetail(
    posts: Post[],
    createdByUsers: User[],
  ): PostWithCreatedByUserDetail[] {
    const result = posts.map((post) => {
      const createdBy = createdByUsers.find(
        (user) => user?._id.toString() === post.createdBy.toString(),
      ) as User;
      return { ...post, createdBy } as unknown as PostWithCreatedByUserDetail;
    });

    return result;
  }

  mapPostToPostWithLikesAndComments(
    post: Post,
    commentUsers: User[],
  ): PostWithLikesAndComments {
    const likes = post?.likes?.length || 0;

    const comments = post.comments?.map((comment) => {
      const commentUser = commentUsers.find(
        (user) => user?._id.toString() === comment.createdBy?.toString(),
      ) as unknown as PopulatedUserDetail;

      return {
        ...comment,
        createdBy: commentUser,
      };
    });

    return {
      ...post,
      createdBy: post.createdBy as unknown as PopulatedUserDetail,
      likes,
      comments,
    };
  }

  mapPostComment(
    comment: Comment,
    commentUser: PopulatedUserDetail,
  ): PostCommentResponse {
    const result = {
      ...comment,
      createdBy: commentUser,
    } as unknown as PostCommentResponse;
    return result;
  }
}
