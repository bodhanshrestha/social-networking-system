import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.model';
import { AssociatedUser, AssociatedUserSchema } from './associated-user.model';
import { PostModule } from 'src/post/post.module';
import { RateLimitingModule } from 'src/shared/modules/ratelimiting.module';

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
    forwardRef(() => PostModule),
    RateLimitingModule,
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
