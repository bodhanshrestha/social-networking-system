import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsNumber, IsNotEmpty } from 'class-validator';

@InputType()
export class StringInput {
  @Field(() => String)
  message: string;
}

@InputType()
export class PaginationQueryDto {
  @Field(() => Number, { nullable: false })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  limit: number;

  @Field(() => Number, { nullable: false })
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  page: number;
}
