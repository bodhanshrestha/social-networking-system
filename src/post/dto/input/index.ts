import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LikeStatus } from 'src/post/enum';
import { PaginationQueryDto } from 'src/shared/dto';

@InputType()
export class CreatePostDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Post contents is required' })
  @IsString({ message: 'Post contents must be a string' })
  contents: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString({ message: 'Post image url must be a string' })
  imageUrl?: string;
}

@InputType()
export class UpdatePostDto extends CreatePostDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Post id is required' })
  @IsString({ message: 'Post id must be a string' })
  postId: string;
}

@InputType()
export class CommentDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Post id is required' })
  @IsString({ message: 'Post id must be a string' })
  postId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Comment contents is required' })
  @IsString({ message: 'Comment contents must be a string' })
  contents: string;
}

@InputType()
export class UpdateCommentDto extends CommentDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Comment id is required' })
  @IsString({ message: 'Comment id must be a string' })
  commentId: string;
}

@InputType()
export class DeleteCommentDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Post id is required' })
  @IsString({ message: 'Post id must be a string' })
  postId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Comment id is required' })
  @IsString({ message: 'Comment id must be a string' })
  commentId: string;
}

@InputType()
export class LikeDto {
  @Field(() => String)
  @IsNotEmpty({ message: 'Post id is required' })
  @IsString({ message: 'Post id must be a string' })
  postId: string;

  @Field(() => String)
  @IsNotEmpty({ message: 'Like Status should not be empty' })
  @IsEnum(LikeStatus, { message: 'Like Status should be like or DISLIKE' })
  likeStatus: LikeStatus;
}

@InputType()
export class PostQueryDto extends PaginationQueryDto {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  type?: string;
}
