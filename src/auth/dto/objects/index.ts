import { ObjectType, Field } from "@nestjs/graphql"


@ObjectType()
export class AuthUserDto {
  @Field()
  _id: string

  @Field()
  name: string

  @Field()
  email: string

  @Field({ nullable: true })
  phone?: string
}

@ObjectType()
export class TokenDto {
  @Field()
  accessToken: string
  @Field()
  refreshToken: string
}

@ObjectType()
export class LoginResponseDto {
  @Field(() => TokenDto)
  token: TokenDto

  @Field(() => AuthUserDto)
  user: AuthUserDto
}


@ObjectType()
export class RegisterResponseDto extends LoginResponseDto { }

@ObjectType()
export class TokenizedUserData {
  @Field(() => String)
  _id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  email: string

}