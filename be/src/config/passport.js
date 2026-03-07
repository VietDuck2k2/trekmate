const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.use(new GoogleStrategy({
   clientID: process.env.GOOGLE_CLIENT_ID,
   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
   callbackURL: process.env.GOOGLE_CALLBACK_URL,
   proxy: true // Required for Heroku/AWS/Reverse Proxy
},
   async (accessToken, refreshToken, profile, done) => {
      try {
         // Check if user already exists with this googleId
         let user = await User.findOne({ googleId: profile.id });

         if (user) {
            return done(null, user);
         }

         // If not, check if user exists with this email
         const email = profile.emails[0].value;
         user = await User.findOne({ email });

         if (user) {
            // Link google account to existing email account
            user.googleId = profile.id;
            await user.save();
            return done(null, user);
         }

         // If user doesn't exist at all, create new user
         user = new User({
            googleId: profile.id,
            email: email,
            displayName: profile.displayName,
            avatarUrl: profile.photos[0]?.value,
            role: 'USER',
            status: 'ACTIVE'
         });

         await user.save();
         done(null, user);
      } catch (error) {
         done(error, null);
      }
   }
));

// Minimal serialization since we use JWT
passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
   try {
      const user = await User.findById(id);
      done(null, user);
   } catch (error) {
      done(error, null);
   }
});

module.exports = passport;
