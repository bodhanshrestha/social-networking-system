import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { AssociatedUser, AssociatedUserSchema } from './associated-user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: AssociatedUser.name,
        schema: AssociatedUserSchema,
      },
    ]),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
