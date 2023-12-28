import { jwt } from '@config/jwt.config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy as BearerStrategy } from 'passport-http-bearer';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwt.secret,
    });
  }

  // exposing payload
  async validate(payload: any, done: VerifiedCallback) {
    // const user = await User.findOne({ where: { id: payload.sub } });
    // if (!user) {
    //   return done(new TokenException('Invalid token supplied'), false);
    // }
    return done(null, null, payload.iat);

    // return done(null, user, payload.iat);
  }
}

@Injectable()
export class TokenStrategy extends PassportStrategy(BearerStrategy) {
  constructor() {
    super();
  }

  // exposing payload
  async validate(token: string, done: VerifiedCallback) {
    // const user = await User.findOne({ where: { api_key: token } });
    // if (!user) {
    //   return done(new TokenException('Invalid api key supplied'), false);
    // }
    return done(null, null, { scope: 'all' });

    // return done(null, user, { scope: 'all' });
  }
}
