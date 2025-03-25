import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
@ObjectType()
export class User {
  @Field(() => String)
  _id: MongooseSchema.Types.ObjectId;

  @Prop()
  @Field(() => String, { description: 'User name' })
  name: string;

  @Prop({ unique: true })
  @Field(() => String, { description: 'User Email' })
  email: string;

  @Prop({ required: false })
  @Field(() => String, { description: 'User Phone Number', nullable: true })
  phone: string;

  @Prop({ required: true })
  @Field(() => String, { description: 'User Password' })
  password: string;

  @Prop({ default: true })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
