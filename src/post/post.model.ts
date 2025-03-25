import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Schema as MongooseSchema } from 'mongoose';

// Comment Schema
@Schema({ timestamps: true })
@ObjectType()
export class Comment {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true })
  contents: string;

  @Field(() => ID)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  isActive?: boolean;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);

// Like Schema
@Schema({ timestamps: true })
@ObjectType()
export class Like {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field(() => ID, { description: 'User Id' })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  isActive?: boolean;
}
export const LikeSchema = SchemaFactory.createForClass(Like);

// Post Schema
@Schema({ timestamps: true })
@ObjectType()
export class Post {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Prop({
    type: String,
    required: true,
  })
  @Field(() => String, { description: 'Post contents' })
  contents: string;

  @Prop({ required: false })
  @Field(() => String, { description: 'Post image url', nullable: true })
  imageUrl?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  @Field(() => ID, { description: 'Post createdby' })
  createdBy: Types.ObjectId;

  @Prop({ type: [CommentSchema], default: [] })
  @Field(() => [Comment], { description: 'Post comments' })
  comments: Comment[];

  @Prop({ type: [LikeSchema], default: [] })
  @Field(() => [Like], { description: 'Post likes' })
  likes: Like[];

  @Field(() => Date, { description: 'Creation timestamp' })
  createdAt?: Date;

  @Field(() => Date, { description: 'Last update timestamp' })
  updatedAt?: Date;

  @Prop({ default: true })
  isActive?: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
