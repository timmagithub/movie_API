const mongoose = require('mongoose');
const bcrypt = require('brcypt');

let movieSchema = mongoose.Schema({
    title: {type: String, required: true},
    year: {type: String},
    genre: {
        genrename: String,
        description: String
    },
    director: {
        name: String,
        birthDate: String,
        bio: String
    },
    image: String,
    description: String,
    featured: Boolean
});

let userSchema = mongoose.Schema({
    userName: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthDate: Date,
    movieList: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;
