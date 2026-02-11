import { Injectable } from '@nestjs/common';
import { PrismaService } from '../src/common/prisma.service';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteAll() {
    await this.deleteUser();
    await this.deletePost();
  }

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'test',
      },
    });
  }

  async deletePost() {
    await this.prismaService.post.deleteMany({
      where: {
        post_text: 'test status',
      },
    });
  }
}
