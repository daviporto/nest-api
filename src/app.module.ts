import { Module } from '@nestjs/common';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UserModule } from './user/infrastructure/user.module';
import { DatabaseModule } from './shared/infrastructure/database/database.module';

@Module({
  imports: [EnvConfigModule, UserModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
