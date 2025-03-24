import { Module } from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { FriendRequestResolver } from './friend-request.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { FriendRequest, FriendRequestSchema } from './friend-request.model';
import {
  AssociatedUser,
  AssociatedUserSchema,
} from 'src/user/associated-user.model';
import { GQLAuthGuard } from 'src/shared/guard/auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: FriendRequest.name,
        schema: FriendRequestSchema,
      },
      {
        name: AssociatedUser.name,
        schema: AssociatedUserSchema,
      },
    ]),
    UserModule,
  ],
  providers: [FriendRequestService, FriendRequestResolver, GQLAuthGuard],
  exports: [FriendRequestService],
})
export class FriendRequestModule {}
