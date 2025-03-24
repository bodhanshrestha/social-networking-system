import { Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { FriendRequestStatus } from 'src/friend-request/enum';
import { PopulatedUserDetail } from 'src/shared/dto';

@ObjectType()
export class FriendRequestResponse {
  @Field(() => ID)
  _id: string;

  @Field(() => PopulatedUserDetail)
  sender: PopulatedUserDetail;

  @Field(() => PopulatedUserDetail)
  receiver: PopulatedUserDetail;

  @Field(() => String)
  status: FriendRequestStatus;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;
}
