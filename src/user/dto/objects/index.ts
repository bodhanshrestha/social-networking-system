import { Field, ObjectType } from '@nestjs/graphql';
import { PopulatedUserDetail } from 'src/shared/dto';

@ObjectType()
export class UserResponse {
  @Field(() => [PopulatedUserDetail])
  rows: PopulatedUserDetail[];

  @Field(() => Number)
  total: number;
}

@ObjectType()
export class AccountResponse {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  email: string;
}
