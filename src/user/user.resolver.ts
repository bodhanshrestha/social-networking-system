import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';
import { UserResponse } from './dto';
import { PaginationQueryDto } from 'src/shared/dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Mutation(() => User)
  // createUser(@Args("userPayload") userPayload: CreateUserDto) {
  //   return this.userService.create(userPayload)
  // }

  @Query(() => UserResponse, { name: 'fetchAllUsers' })
  async findAll(
    @Args('payload') payload: PaginationQueryDto,
  ): Promise<UserResponse> {
    const result = await this.userService.findAll(payload);
    return result;
  }

  @Query(() => User, { name: 'fetchUserById' })
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }
}
