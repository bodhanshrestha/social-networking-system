import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from './user.model';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // mutation {
  //   createUser(
  //     userPayload: {
  //       email: "bodhan@gmail.com"
  //       name: "Bodhan"
  //       password: "bodhan12345"
  //       phone: ""
  //     }
  //   ) {
  //     _id
  //     name
  //     email
  //   }
  // }

  // @Mutation(() => User)
  // createUser(@Args("userPayload") userPayload: CreateUserDto) {
  //   return this.userService.create(userPayload)
  // }

  // query{
  //   users{
  //     _id
  //     name
  //     email
  //   }
  // }
  @Query(() => [User], { name: 'fetchAllUsers' })
  findAll() {
    return this.userService.findAll();
  }

  // query{
  //   user(id:"67dc44d265bec60efd75b333"){
  //     _id
  //     name
  //     email
  //   }
  // }
  @Query(() => User, { name: 'fetchUserById' })
  findOne(@Args('id') id: string) {
    return this.userService.findOne(id);
  }
}
