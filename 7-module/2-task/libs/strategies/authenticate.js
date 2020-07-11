module.exports = function authenticate(strategy, email, displayName, done) {
  const User = require('../../models/User.js');

  if (!email) {
    return done(null, false, 'Не указан email');
  }

  User.findOne({email: email}, null, null, async function (err, user) {
    if (err) {
      return done(err)
    }
    if (!user) {
      user = new User({
          "email": email,
          "displayName": displayName
        },
      );
      try {
        await user.save();
      } catch (e) {
        return done(e);
      }
    }

    return done(null, user)
  })
};
