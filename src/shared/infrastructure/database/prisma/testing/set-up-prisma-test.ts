import { execSync } from 'node:child_process';

export function setUpPrismaTest() {
  execSync('npm run prisma:migrate-test');
}
