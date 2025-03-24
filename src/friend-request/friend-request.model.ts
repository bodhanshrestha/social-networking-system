import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Types } from 'mongoose';

import { FriendRequestStatus } from './enum';

@Schema({ timestamps: true })
@ObjectType()
export class FriendRequest {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field(() => ID, { description: 'User Id' })
  senderId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  @Field(() => ID, { description: 'User Id' })
  receiverId: Types.ObjectId;

  @Prop({
    type: String,
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  @Field(() => String, { description: `Friend Request Status` })
  status: FriendRequestStatus;

  @Field(() => Date, { description: 'Creation timestamp' })
  createdAt?: Date;

  @Field(() => Date, { description: 'Last update timestamp' })
  updatedAt?: Date;
}

export const FriendRequestSchema = SchemaFactory.createForClass(FriendRequest);
