import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './db.js';

const configurePassport = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_SIGNIN_CALLBACK_URL,
        scope: ['profile', 'email'],
        state: true,
      },
      async (accessToken, refreshToken, profile, cb) => {
        try {
          let user = await prisma.user.findFirst({
            where: { providerId: profile.id },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                username: profile.displayName,
                email: profile.emails[0].value,
                name: profile.displayName,
                providerId: profile.id,
                provider: 'GOOGLE',
                refreshToken,
              },
            });
          }

          return cb(null, user);
        } catch (err) {
          console.error(err);
          return cb(err);
        }
      }
    )
  );

  passport.serializeUser((user, cb) => {
    process.nextTick(() => {
      cb(null, { id: user.id, username: user.username, name: user.name });
    });
  });

  passport.deserializeUser(async (user, cb) => {
    try {
      const foundUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      process.nextTick(() => cb(null, foundUser));
    } catch (err) {
      console.error(err);
      cb(err);
    }
  });
};

export { configurePassport };
