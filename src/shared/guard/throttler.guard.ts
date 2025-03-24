import { Injectable, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class GraphQLThrottlerGuard extends ThrottlerGuard {
  getRequestResponse(context: ExecutionContext) {
    // For GraphQL, we need to extract request/response differently
    if (context.getType() === 'http') {
      return {
        req: context.switchToHttp().getRequest(),
        res: context.switchToHttp().getResponse(),
      };
    }

    // Handle GraphQL context
    const gqlCtx = GqlExecutionContext.create(context);
    const ctx = gqlCtx.getContext();

    return { req: ctx.req, res: ctx.res };
  }

  // Override the extractIP method to handle cases where IP might be missing
  protected getIp(req: Record<string, any>): string {
    // Try to get IP from various possible locations
    const ip =
      req.ip ||
      (req.headers && req.headers['x-forwarded-for']) ||
      (req.connection && req.connection.remoteAddress) ||
      '127.0.0.1'; // Fallback to localhost if no IP found

    return Array.isArray(ip) ? ip[0] : ip;
  }
}
