import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GQLAuthGuard } from '../guard/auth.guard';

@Module({
  imports: [
    NestGraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      cors: {
        origin: true,
        credentials: true,
      },
      formatResponse: (response) => {
        return {
          success: true,
          data: response,
        };
      },
      formatError: (error: any) => {
        // Get the original error from the extensions context
        const originalError = error.extensions?.originalError || error;

        // Handle Mongoose duplicate key error (E11000)
        if (
          originalError.code === 11000 ||
          (originalError.message && originalError.message.includes('E11000'))
        ) {
          // Extract the field name from the error message
          const fieldMatch = originalError.message.match(/index:\s+(\w+)_/);
          const field = fieldMatch ? fieldMatch[1] : 'field';

          return {
            message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`,
            code: 'DUPLICATE_KEY',
            status: 409,
            success: false,
          };
        }

        // Handle validation errors
        if (originalError.name === 'ValidationError') {
          const validationErrors = Object.values(originalError.errors || {})
            .map((err: any) => err.message)
            .join(', ');

          return {
            message: validationErrors || 'Validation failed',
            code: 'VALIDATION_ERROR',
            status: 400,
            success: false,
          };
        }

        return {
          message: error.message || 'Internal server error',
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
          success: false,
          status:
            error.extensions?.originalError?.statusCode ||
            error.extensions?.statusCode ||
            500,
          ...(process.env.NODE_ENV !== 'production' && {
            details: error.extensions?.stacktrace,
          }),
        };
      },
    }),
  ],
  providers: [GQLAuthGuard],
  exports: [GQLAuthGuard],
})
export class GraphQLModule {}
