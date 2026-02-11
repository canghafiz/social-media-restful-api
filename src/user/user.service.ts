import { HttpException, Inject, Injectable } from '@nestjs/common';
import { LoginUserRequest, RegisterUserRequest } from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  private async generateAndSaveToken(userId: number): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const accessToken = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload: JwtPayload = { userId, accessToken };

    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: '7d',
    });

    // Simpan access token + expire ke DB
    await this.prismaService.user.update({
      where: { userId },
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        access_token: accessToken,
        access_token_expire: expiresAt,
      },
    });

    return token;
  }

  async register(request: RegisterUserRequest): Promise<string> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);

    const registerRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request,
    ) as RegisterUserRequest;

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: { username: registerRequest.username },
    });

    if (totalUserWithSameUsername !== 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return this.generateAndSaveToken(user.userId);
  }

  async login(request: LoginUserRequest): Promise<string> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);

    const loginRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    ) as LoginUserRequest;

    const user = await this.prismaService.user.findUnique({
      where: { username: loginRequest.username },
    });

    if (!user) {
      throw new HttpException('Username or password is invalid', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Username or password is invalid', 401);
    }

    return this.generateAndSaveToken(user.userId);
  }
}
