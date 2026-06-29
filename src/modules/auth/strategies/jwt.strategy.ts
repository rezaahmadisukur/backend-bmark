import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/infra/prisma/prisma.service';

// Interface untuk payload yang kita simpan di JWT
export interface JwtPayload {
  sub: string; // subject = user id
  email: string;
}

// Interface untuk user yang di-attach ke requrest
export interface JwtUser {
  id: string;
  email: string;
  name: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prismaService: PrismaService,
  ) {
    const secret = configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(jwtPayload: JwtPayload): Promise<JwtUser> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: jwtPayload.sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException(
        'User no longer exists or has been deleted',
      );
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
