import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';

@Controller('/api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async register(@Body() request: RegisterUserRequest): Promise<UserResponse> {
    const token = await this.userService.register(request);
    return {
      success: true,
      code: HttpStatus.CREATED,
      data: token,
    };
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() request: LoginUserRequest): Promise<UserResponse> {
    const token = await this.userService.login(request);
    return {
      success: true,
      code: HttpStatus.OK,
      data: token,
    };
  }
}
