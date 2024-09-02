import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfigModule } from './shared/infrastructure/env-config/env-config.module';
import { UserModule } from './user/infrastructure/user.module';

@Module({
  imports: [EnvConfigModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
