import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    super({
      log: [
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'query' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();

    // @ts-expect-error - Prisma typing limitation
    this.$on('info', (e) => this.logger.info(e));
    // @ts-expect-error - Prisma typing limitation
    this.$on('warn', (e) => this.logger.warn(e));
    // @ts-expect-error - Prisma typing limitation
    this.$on('error', (e) => this.logger.error(e));
    // @ts-expect-error - Prisma typing limitation
    this.$on('query', (e) => this.logger.debug(e));
  }
}