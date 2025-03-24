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

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: AssociatedUser.name,
        schema: AssociatedUserSchema,
      },
    ]),
    UserModule,
  ],
  providers: [PostService, PostResolver, PostMapper],
})
export class PostModule {}
