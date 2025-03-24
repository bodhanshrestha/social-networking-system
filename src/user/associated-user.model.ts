import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";


@Schema()
@ObjectType()
export class AssociatedUser {
  @Field(() => ID)
  _id: MongooseSchema.Types.ObjectId

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  @Field(() => ID, { description: "User Id" })
  userId: MongooseSchema.Types.ObjectId

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: "User" }] })
  @Field(() => [ID], { description: "User Friends" })
  friends: MongooseSchema.Types.ObjectId[]
}

export const AssociatedUserSchema = SchemaFactory.createForClass(AssociatedUser)