import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { FriendRequestStatus } from 'src/friend-request/enum';

@InputType()
export class CreateFriendRequestDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  receiverId: string;

  // @Field({ nullable: true })
  // @IsOptional()
  // @IsString()
  // senderId: string
}

@InputType()
export class UpdateFriendRequestStatusDto {
  @Field()
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @Field()
  @IsNotEmpty()
  @IsEnum(FriendRequestStatus)
  status: FriendRequestStatus;
}
