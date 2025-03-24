import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { TokenizedUserData } from "src/auth/dto";



@Injectable()
export class GQLAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService) { }


  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context)

    const { req } = ctx.getContext()

    try {
      const token = this.extractTokenHeader(req)

      if (!token) {
        throw new UnauthorizedException()
      }
      const user: TokenizedUserData = await this.jwtService.verify(token, {
        secret: this.configService.get("ACCESS_TOKEN_SECRET")
      })

      req.user = user

      return true
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException()
    }

  }

  extractTokenHeader(request: Request): string | undefined {
    const token = request.cookies?.['access_token']
    return token
  }


}