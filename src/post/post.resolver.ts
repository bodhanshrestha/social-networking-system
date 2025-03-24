import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Comment, Post } from './post.model';
import {
  CommentDto,
  CreatePostDto,
  DeleteCommentDto,
  LikeDto,
  PostQueryDto,
  UpdateCommentDto,
  UpdatePostDto,
} from './dto/input';
import { LoggedInUser } from 'src/shared/decorator/logged-in-user.decorator';
import { TokenizedUserData } from 'src/auth/dto';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from 'src/shared/guard/auth.guard';
import {
  PostCommentResponse,
  PostUpdateResponse,
  PostWithCreatedByUserDetail,
  PostWithLikesAndComments,
  UpdateCommentResponse,
} from './dto/objects';
import { PostFetchType } from './enum';

@Resolver()
@UseGuards(GQLAuthGuard)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => Number, { nullable: true })
  async getPostsCount(
    @Args('type', { nullable: true }) type: PostFetchType,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ) {
    return await this.postService.findAllPostsCount(loggedInUser._id, type);
  }

  @Query(() => [PostWithCreatedByUserDetail])
  async getPosts(
    @Args('payload') payload: PostQueryDto,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ) {
    const result = await this.postService.findAllPosts(
      loggedInUser._id,
      payload,
    );
    return result;
  }

  @Query(() => PostWithLikesAndComments)
  async getPostById(
    @Args('postId') postId: string,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ) {
    return await this.postService.findPostById(postId, loggedInUser._id);
  }

  @Mutation(() => Post)
  async createPost(
    @Args('payload') payload: CreatePostDto,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ): Promise<Post> {
    return await this.postService.createPost(payload, loggedInUser._id);
  }

  @Mutation(() => PostUpdateResponse)
  async updatePost(
    @Args('payload') payload: UpdatePostDto,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ): Promise<PostUpdateResponse> {
    return await this.postService.updatePost(payload, loggedInUser._id);
  }

  @Mutation(() => String)
  async deletePost(
    @Args('postId') postId: string,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ): Promise<string> {
    return await this.postService.deletePost(postId, loggedInUser._id);
  }

  @Query(() => [PostCommentResponse])
  async getPostComments(
    @Args('postId') postId: string,
  ): Promise<PostCommentResponse[]> {
    return await this.postService.findAllPostComments(postId);
  }

  @Query(() => PostCommentResponse)
  async getPostCommentById(
    @Args('postId') postId: string,
    @Args('commentId') commentId: string,
  ): Promise<PostCommentResponse> {
    return await this.postService.findPostCommentById(postId, commentId);
  }

  @Mutation(() => PostCommentResponse)
  async createPostComment(
    @Args('payload') payload: CommentDto,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ): Promise<PostCommentResponse> {
    return await this.postService.createPostComment(payload, loggedInUser._id);
  }

  @Mutation(() => UpdateCommentResponse)
  async updatePostComment(
    @Args('payload') payload: UpdateCommentDto,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ): Promise<UpdateCommentResponse> {
    return await this.postService.updatePostComment(payload, loggedInUser._id);
  }

  @Mutation(() => String)
  async deletePostComment(
    @Args('payload') payload: DeleteCommentDto,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ): Promise<string> {
    return await this.postService.deletePostComment(payload, loggedInUser._id);
  }

  @Mutation(() => String)
  async likePost(
    @Args('payload') payload: LikeDto,
    @LoggedInUser() loggedInUser: TokenizedUserData,
  ): Promise<string> {
    return await this.postService.likePost(payload, loggedInUser._id);
  }
}
