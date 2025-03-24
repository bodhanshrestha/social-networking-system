import { JwtService } from '@nestjs/jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { AuthUserDto, LoginDto, LoginResponseDto, RegisterDto, RegisterResponseDto, TokenizedUserData } from './dto';
import { comparePassword, hashPassword } from 'src/shared/utils/hashPassword';
import { messages } from './constants';
import { User } from 'src/user/user.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {

  constructor(private readonly userService: UserService, private jwtService: JwtService, private readonly configService: ConfigService) { }

  private issueToken(user: User) {
    const userData: TokenizedUserData = {
      _id: user?._id?.toString(),
      name: user.name,
      email: user.email,
    }

    const accessToken = this.jwtService.sign(userData, {
      secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION_TIME')
    })

    const refreshToken = this.jwtService.sign(userData, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRATION_TIME')
    })

    return { accessToken, refreshToken }
  }

  public async login(payload: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.findOneByEmail(payload.email)
    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND)
    }

    const isPasswordValid = await comparePassword(payload.password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException(messages.INVALID_CREDENTIALS)
    }

    const { accessToken, refreshToken } = this.issueToken(user)

    const userData: AuthUserDto = {
      _id: user?._id?.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone
    }
    return {
      token: { accessToken, refreshToken }, user: userData
    }

  }


  public async register(payload: RegisterDto): Promise<RegisterResponseDto> {

    if (payload.password !== payload.confirmPassword) {
      throw new BadRequestException(messages.PASSWORD_AND_CONFIRM_PASSWORD_DO_NOT_MATCH)
    }

    const user = await this.userService.findOneByEmail(payload.email)
    if (user) {
      throw new BadRequestException(messages.USER_ALREADY_EXISTS)
    }

    const hashedPassword = await hashPassword(payload.password)
    const newUser = await this.userService.create({
      ...payload,
      password: hashedPassword
    })

    const userData: AuthUserDto = {
      _id: newUser?._id?.toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone
    }

    const { accessToken, refreshToken } = this.issueToken(newUser)


    return {
      token: { accessToken, refreshToken }, user: userData
    }
  }

  public async refreshToken(incomingRefreshToken: string | null) {
    if (!incomingRefreshToken) {
      throw new BadRequestException(messages.REFRESH_TOKEN_NOT_FOUND)
    }

    const decoded = this.jwtService.verify(incomingRefreshToken, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET')
    })

    const user = await this.userService.findOneById(decoded._id)
    if (!user) {
      throw new BadRequestException(messages.USER_NOT_FOUND)
    }

    const { accessToken } = this.issueToken(user)

    return accessToken
  }
}
