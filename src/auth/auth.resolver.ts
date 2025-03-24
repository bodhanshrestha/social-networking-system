import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthUserDto } from './dto';
import { Request, Response } from 'express';
import { deleteAuthToken, setAuthToken } from 'src/shared/utils/cookies';
import { TokenType } from 'src/shared/enums';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthUserDto)
  async login(
    @Args('payload') payload: LoginDto,
    @Context() { res }: { res: Response },
  ) {
    const {
      token: { accessToken, refreshToken },
      user,
    } = await this.authService.login(payload);

    setAuthToken(res, TokenType.ACCESS_TOKEN, accessToken);
    setAuthToken(res, TokenType.REFRESH_TOKEN, refreshToken);

    return user;
  }

  @Mutation(() => AuthUserDto)
  async register(
    @Args('payload') payload: RegisterDto,
    @Context() { res }: { res: Response },
  ) {
    const {
      token: { accessToken, refreshToken },
      user,
    } = await this.authService.register(payload);

    setAuthToken(res, TokenType.ACCESS_TOKEN, accessToken);
    setAuthToken(res, TokenType.REFRESH_TOKEN, refreshToken);

    return user;
  }

  @Mutation(() => String)
  logout(@Context() { res }: { res: Response }) {
    deleteAuthToken(res, TokenType.ACCESS_TOKEN);
    deleteAuthToken(res, TokenType.REFRESH_TOKEN);
    return 'Logged out successfully';
  }

  @Mutation(() => String)
  async refreshToken(@Context() { req, res }: { req: Request; res: Response }) {
    const refreshToken = req.cookies[TokenType.REFRESH_TOKEN];
    const newAccessToken = await this.authService.refreshToken(refreshToken);

    setAuthToken(res, TokenType.ACCESS_TOKEN, newAccessToken);

    return 'Token refreshed successfully';
  }
}
