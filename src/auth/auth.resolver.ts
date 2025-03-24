import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AuthUserDto } from './dto';
import { Request, Response } from 'express';
import { deleteAuthToken, setAuthToken } from 'src/shared/utils/cookies';
import { TokenType } from 'src/shared/enums';

@Resolver()
export class AuthResolver {

  constructor(private readonly authService: AuthService) { }

  // mutation {
  //   login(payload: { email: "bodhan@gmail.com", password: "bodhan12345" }) {
  //     _id
  //     name
  //     email
  //   }
  // }

  @Mutation(() => AuthUserDto)
  async login(@Args("payload") payload: LoginDto, @Context() { res }: { res: Response }) {
    const { token: { accessToken, refreshToken }, user } = await this.authService.login(payload)

    setAuthToken(res, TokenType.ACCESS_TOKEN, accessToken)
    setAuthToken(res, TokenType.REFRESH_TOKEN, refreshToken)

    return user
  }


  // mutation {
  //   register(payload: { email: "bodhan1@gmail.com", password: "bodhan12345",name:"bodhan",confirmPassword:"bodhan12345",phone:"" }) {
  //     _id
  //     name
  //     email
  //   }
  // }

  @Mutation(() => AuthUserDto)
  // @Mutation("register")
  async register(@Args("payload") payload: RegisterDto, @Context() { res }: { res: Response }) {
    const { token: { accessToken, refreshToken }, user } = await this.authService.register(payload)

    setAuthToken(res, TokenType.ACCESS_TOKEN, accessToken)
    setAuthToken(res, TokenType.REFRESH_TOKEN, refreshToken)

    return user
  }

  @Mutation(() => String)
  logout(@Context() { res }: { res: Response }) {
    deleteAuthToken(res, TokenType.ACCESS_TOKEN)
    deleteAuthToken(res, TokenType.REFRESH_TOKEN)
    return "Logged out successfully"
  }


  @Mutation(() => String)
  async refreshToken(@Context() { req, res }: { req: Request, res: Response }) {
    const refreshToken = req.cookies[TokenType.REFRESH_TOKEN]
    const newAccessToken = await this.authService.refreshToken(refreshToken)

    setAuthToken(res, TokenType.ACCESS_TOKEN, newAccessToken)

    return "Token refreshed successfully"
  }
}
