import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UserModule } from './user/infrastructure/user.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';
import { AuthModule } from './auth/infrastructure/auth.module';

@Module({
  imports: [EnvConfigModule, UserModule, DatabaseModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
