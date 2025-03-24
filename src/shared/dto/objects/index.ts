import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Types } from 'mongoose';

@ObjectType()
export class StringResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class PopulatedUserDetail {
  @Field(() => ID)
  _id?: Types.ObjectId;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;
}
