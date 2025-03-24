import { Injectable } from '@nestjs/common';
import { AuthUserDto, TokenizedUserData } from './dto';
import { User } from 'src/user/user.model';

@Injectable()
export class AuthMapper {
  constructor() {}
  mapUserToAuthUserDto(user: User): AuthUserDto {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  }

  mapUserToTokenizedUserData(user: User): TokenizedUserData {
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    };
  }
}
