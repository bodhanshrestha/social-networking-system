import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { TokenizedUserData } from 'src/auth/dto';

export const LoggedInUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    // Return the entire user object by default
    if (!data) {
      return req.user;
    }

    // Or return a specific property if requested
    return { ...req.user, _id: req.user._id?.toString() } as TokenizedUserData;
  },
);