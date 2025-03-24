import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './shared/modules/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { FriendRequestModule } from './friend-request/friend-request.module';
import { PostModule } from './post/post.module';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLThrottlerGuard } from './shared/guard/throttler.guard';

@Module({
  imports: [
    CommonModule,
    UserModule,
    AuthModule,
    FriendRequestModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GraphQLThrottlerGuard,
    },
  ],
})
export class AppModule {}
