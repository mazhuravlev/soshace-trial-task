const User = require('./user');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('koa-passport');

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({username: username});
    if (!user) {
        done('User not found');
    }
    if (user.password !== password) {
        done('Wrong password');
    }
    done(null, user);
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});