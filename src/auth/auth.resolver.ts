import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthUserDto, TokenizedUserData } from './dto';
import { Request, Response } from 'express';
import { deleteAuthToken, setAuthToken } from 'src/shared/utils/cookies';
import { TokenType } from 'src/shared/enums';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from 'src/shared/guard/auth.guard';
import { LoggedInUser } from 'src/shared/decorator/logged-in-user.decorator';
import { AccountResponse } from 'src/user/dto';

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

  @Mutation(() => AccountResponse)
  @UseGuards(GQLAuthGuard)
  async deactivateAccount(
    @LoggedInUser() user: TokenizedUserData,
  ): Promise<AccountResponse> {
    return await this.authService.deactivateAccount(user.email.toString());
  }

  @Mutation(() => AccountResponse)
  async activateAccount(
    @Args('email') email: string,
    @Context() { res }: { res: Response },
  ): Promise<AccountResponse> {
    const response = await this.authService.activateAccount(email);
    deleteAuthToken(res, TokenType.ACCESS_TOKEN);
    deleteAuthToken(res, TokenType.REFRESH_TOKEN);
    return response;
  }
}
