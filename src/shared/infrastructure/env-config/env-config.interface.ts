export interface EnvConfig {
  getAppPort(): Number;

  getNodeEnv(): string;

  getJwtSecret(): string;

  getJwtExpiresIn(): number;
}
