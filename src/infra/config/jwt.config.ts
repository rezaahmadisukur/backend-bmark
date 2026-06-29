import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

type ExpiresIn = `${number}${'d' | 'h' | 'm' | 's'}`;

// ✅ Export this function so strategy can use it too
export const getJwtSecret = (configService: ConfigService): string => {
  // Get config in .env file
  const secret = configService.get<string>('JWT_SECRET');

  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required');
  }

  return secret;
};

export const jwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const secret = getJwtSecret(configService);
  const expiresIn = configService.get<string>('JWT_ACCESS_EXPIRES_IN');

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
