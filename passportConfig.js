const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/user'); // Assuming your user model is imported correctly

function initialize(passport) {
  
  const authenticateUser = async (email, password, done) => {
    try {
      const user = await User.findOne({ email: email });

      if (!user) {
        return done(null, false, { message: 'No user with that email' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (error) {
      return done(error);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  
  
}

module.exports = initialize;
