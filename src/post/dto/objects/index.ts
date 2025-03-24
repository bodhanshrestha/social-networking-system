import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { PopulatedUserDetail } from 'src/shared/dto';

@ObjectType()
export class UpdateCommentResponse {
  @Field(() => String)
  contents: string;
}

@ObjectType()
export class PostCommentResponse {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Field(() => String)
  contents: string;

  @Field(() => PopulatedUserDetail)
  createdBy: PopulatedUserDetail;

  @Field(() => Date)
  createdAt?: Date;
}

@ObjectType()
export class PostWithCreatedByUserDetail {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => PopulatedUserDetail)
  createdBy: PopulatedUserDetail;

  @Field(() => Date)
  createdAt?: Date;
}

@ObjectType()
export class PostUpdateResponse {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Field(() => String)
  contents: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;
}

@ObjectType()
export class PostWithLikesAndComments extends PostWithCreatedByUserDetail {
  @Field(() => Number)
  likes: number;

  @Field(() => [PostCommentResponse])
  comments: PostCommentResponse[];
}
