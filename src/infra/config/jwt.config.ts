import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type ExpiresIn = `${number}${'d' | 'h' | 'm' | 's'}`;

export const jwtConfig = (config: ConfigService): JwtModuleOptions => {
  const secret = config.get<string>('JWT_SECRET');
  const expiresIn = config.get<string>('JWT_ACCESS_EXPIRES_IN');

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  // Validate format: harus "7d", "15m", "1h", "30s"
  const isValid = /^\d+[smhd]$/.test(expiresIn ?? '');

  if (!isValid) {
    throw new Error(
      `JWT_ACCESS_EXPIRES_IN must be in format like "7d", "15m", "1h", "30s" - got: "${expiresIn}"`,
    );
  }

  return {
    secret,
    signOptions: {
      expiresIn: expiresIn as ExpiresIn,
    },
  };
};
