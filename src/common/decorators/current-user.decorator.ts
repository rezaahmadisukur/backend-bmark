import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtUser } from 'src/modules/auth/strategies/jwt.strategy';

/**
 * Decorator untuk extract user dari request (di-set ole Passport JWT)
 *
 * @param data - Optional field name dari JwtUser
 * @param ctx - Execution context dari NestJS
 * @returns - JwtUser object atau specific field
 *
 * @example
 * @CurrentUser() user: JwtUser           // Returns entire user object
 * @CurrentUser('id') userId: string      // Returns only user.id
 * @CurrentUser('email') email: string   // Returns only user.email
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtUser | undefined, ctx: ExecutionContext): unknown => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user = request.user as JwtUser;

    if (data && user) {
      return user[data];
    }

    return user;
  },
);
