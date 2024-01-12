import { jwt } from '@config/jwt.config';
import { Owner } from '@db/entities/owner/owner.entity';
import { TokenException } from '@lib/exceptions/token.exception';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class JwtOwnerStrategy extends PassportStrategy(Strategy, 'jwt-owner') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  // exposing payload
  async validate(payload: any, done: VerifiedCallback) {
    const user = await Owner.findOne(payload.sub);
    if (!user) {
      return done(new TokenException('Invalid token supplied'), false);
    }

    return done(null, user, payload.iat);
  }
}
