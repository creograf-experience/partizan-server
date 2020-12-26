const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const UserModel = require('../models/user');
const config = require('../config');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwtSecret
};

module.exports = passport =>
  passport.use(
    // eslint-disable-next-line new-cap
    new jwtStrategy(opts, async (jwtPayload, done) => {
      try {
        const user = await UserModel.findById(jwtPayload._id);
        if (user) return done(null, user);

        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
