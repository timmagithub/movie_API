const passport = require('passport'),
    LocalStrategy = require('passport-local'),
    Models = require('./models.js'),
    passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    userNameField: 'userName',
    passwordField: 'password'
}, (userName, password, callback) => {
    console.log(userName + ' ' + password);
    Users.findOne({userName: userName}, (error, user) =>{
        if (error) {
            console.log(error);
            return callback(error);
        } if (!user) {
            console.log('incorrect userName');
            return callback(null, false, {message: 'Incorrect userName or password.'});
        }
        console.log('finished');
        return callback(null, user);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((error) => {
        return callback(error)
    });
}));