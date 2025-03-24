import { Field, InputType, } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


@InputType()
export class RegisterDto {
  @Field()
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Email should be valid" })
  email: string

  @Field()
  @IsNotEmpty({ message: "Password should not be empty" })
  @IsString({ message: "Password should be string" })
  @MinLength(8, { message: "Password should be at least 8 characters long" })
  password: string

  @Field()
  @IsNotEmpty({ message: "Confirm password should not be empty" })
  @IsString({ message: "Confirm password should be string" })
  @MinLength(8, { message: "Confirm password should be at least 8 characters long" })
  confirmPassword: string


  @Field()
  @IsNotEmpty({ message: "Name should not be empty" })
  @IsString({ message: "Name should be string" })
  name: string

  @Field()
  @IsOptional()
  @IsString({ message: "Phone should be string" })
  phone: string
}


@InputType()
export class LoginDto {
  @Field()
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Email should be valid" })
  email: string

  @Field()
  @IsNotEmpty({ message: "Password should not be empty" })
  @IsString({ message: "Password should be string" })
  @MinLength(8, { message: "Password should be at least 8 characters long" })
  password: string
}