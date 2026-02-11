import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from './jwt-payload.interface';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user?: unknown }>();
    if (!request.user)
      throw new UnauthorizedException('User not found in request');
    return request.user as JwtPayload;
  },
);
