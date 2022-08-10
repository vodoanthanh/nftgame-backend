import { HttpException } from '@/exceptions/HttpException';
import { User } from '@/models/user.model';
import _ from 'lodash';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY ?? 'secret'
};

passport.use('jwt', new JwtStrategy(opts, async (jwtPayload, done) => {
  try {
    const dataUserFromToken = jwtPayload.payload;
    const user = await User.findOne({ where: { walletID: dataUserFromToken.walletID } });

    if (_.isEmpty(user)) {
      return done(new HttpException(401, 'Your account is not found or inactive!', 'NOT_FOUND'), false);
    }

    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));
