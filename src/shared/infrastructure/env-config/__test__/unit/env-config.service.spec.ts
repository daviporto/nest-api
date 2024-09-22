import { Test, TestingModule } from '@nestjs/testing';
import { EnvConfigService } from '../../env-config.service';
import { EnvConfigModule } from '../../env-config.module';

describe('EnvConfigService unit tests', () => {
  let sut: EnvConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [EnvConfigModule.forRoot()],
      providers: [EnvConfigService],
    }).compile();

    sut = module.get<EnvConfigService>(EnvConfigService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should return port variable', () => {
    expect(sut.getAppPort()).toBe(3000);
  });

  it('should return port variable', () => {
    expect(sut.getNodeEnv()).toBe('test');
  });

  it('should return jwt secret', () => {
    expect(sut.getJwtSecret()).toBe('test');
  });

  it('should return jwt expires in', () => {
    expect(sut.getJwtExpiresIn()).toBe(`${60 * 60 * 1000}`);
  });
});
