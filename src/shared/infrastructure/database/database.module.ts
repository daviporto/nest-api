import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [EnvConfigModule.forRoot()],
  providers: [ConfigService, PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
