import { ApiResponse } from './api.model';

export class RegisterUserRequest {
  email: string;
  firstName: string;
  lastName?: string | null;
  username: string;
  password: string;
}

export class LoginUserRequest {
  username: string;
  password: string;
}

export type UserResponse = ApiResponse<string>;
