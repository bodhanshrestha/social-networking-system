import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserModule } from 'src/user/user.module';
import { AuthMapper } from './auth.mapper';

@Module({
  imports: [UserModule],
  providers: [AuthService, AuthResolver, AuthMapper],
})
export class AuthModule {}
