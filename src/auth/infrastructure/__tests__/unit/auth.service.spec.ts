import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EnvConfigService } from '@/shared/infrastructure/env-config/env-config.service';
import { EnvConfigModule } from '@/shared/infrastructure/env-config/env-config.module';

describe('Auth service unit tests', () => {
  let sut: AuthService;
  let module: TestingModule;
  let jwtService: JwtService;
  let envConfigService: EnvConfigService;
  let configService: ConfigService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [EnvConfigModule, JwtModule],
      providers: [AuthService],
    }).compile();
  });

  beforeEach(() => {
    jwtService = new JwtService({
      global: true,
      secret: 'test',
      signOptions: { expiresIn: 60 * 60, subject: 'test' },
    });

    configService = new ConfigService();
    envConfigService = new EnvConfigService(configService);
    sut = new AuthService(jwtService, envConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should generate jwt', async () => {
    const token = await sut.generateJwt('test');
    expect(token.accessToken).toBeDefined();
  });

  it('should verify valid jwt', async () => {
    const token = await sut.generateJwt('test');
    const decoded = await sut.verifyJwt(token.accessToken);
    expect(decoded.id).toBe('test');
  });

  it('should throw error when jwt is invalid', async () => {
    const token = await sut.generateJwt('test');
    await expect(
      sut.verifyJwt(token.accessToken + 'invalid'),
    ).rejects.toThrow();
  });
});
