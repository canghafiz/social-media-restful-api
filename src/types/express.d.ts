import { JwtPayload } from '../auth/jwt-auth.guard';

declare module 'express' {
  export interface Request {
    user?: JwtPayload;
  }
}
