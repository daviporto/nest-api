import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '@/user/infrastructure/user.module';
import { JwtModule } from '@nestjs/jwt';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';

@Module({
  imports: [
    EnvConfigModule,
    JwtModule.registerAsync({
      imports: [EnvConfigModule],
      useFactory: async (envConfigService: EnvConfigService) => ({
        global: true,
        secret: envConfigService.getJwtSecret(),
        signOptions: { expiresIn: envConfigService.getJwtExpiresIn() },
      }),
      inject: [EnvConfigService],
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
