import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './post.model';
import {
  AssociatedUser,
  AssociatedUserSchema,
} from 'src/user/associated-user.model';
import { UserModule } from 'src/user/user.module';
import { PostMapper } from './post.mapper';
import { RateLimitingModule } from 'src/shared/modules/ratelimiting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
    ]),
    UserModule,
    RateLimitingModule,
  ],
  providers: [PostService, PostResolver, PostMapper],
})
export class PostModule {}
