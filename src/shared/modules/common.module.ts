import { Module } from '@nestjs/common';
import { ConfigModule } from './config.module';
import { MongooseModule } from './mongoose.module';
import { GraphQLModule } from './graphql.module';
import { RateLimitingModule } from './ratelimiting.module';
import { JwtModule } from './jwt.module';

@Module({
  imports: [
    ConfigModule,
    MongooseModule,
    RateLimitingModule,
    GraphQLModule,
    JwtModule
  ],
  // exports: [ConfigModule, MongooseModule, RateLimitingModule, GraphQLModule, JwtModule]
})
export class CommonModule { }
