const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const app = express();

app.use(express.urlencoded({extended: true}));

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/quikFlix', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useFindAndModify: false
});

app.use(morgan('common'));

const cors = require('cors');

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];
app.use(cors({
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
            return callback(new Error(message ), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app);

const passport = require('passport');
const { check } = require('express-validator');
require('./passport');

/*requests to navigate the site*/ 
app.get('/', (req, res) => {
    res.send('Welcome to quikFlix');
});

/* get list of all movies */
app.get('/movies', passport.authenticate('jwt', {session:false}), (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});    

/* get user's list of top movies */
app.get('/users/:userName/myMovies', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOne({userName: req.params.userName})
    .then((movieList) => {
        res.json(movieList);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err)
    }); 
});

/* get info on movie by title */
app.get('/movies/:title', passport.authenticate('jwt', {session:false}), (req, res) => {
    Movies.findOne({title: req.params.title})
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

/* get genre info by name */
app.get('/genres/:genre', passport.authenticate('jwt', {session:false}), (req, res) => {
    Movies.find({'genre.genrename': req.params.genre})
    .then((genre) => {
        res.json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

/* get info on director */
app.get('/directors/:name', passport.authenticate('jwt', {session:false}), (req, res) => {
    Movies.findOne({'director.name': req.params.name})
    .then((director) => {
        res.json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

/* create a new user */
app.post('/users', [
    check('userName', 'Username is required and must be at least 5 alphanumeric characters long.').isLength({min: 5}),
    check('userName', 'Username contains non alphanermic characters - not allowed').isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
    
    let hashedPassword = Users.hashPassword(req.body.password);
    
    Users.findOne({userName: req.body.userName})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.userName + 'already exists');
        } else {
            Users
                .create({
                    userName: req.body.userName,
                    password: hashedPassword,
                    email: req.body.email,
                    birthDate: req.body.birthDate
                })
                .then ((user) => {
                    res.status(201).json(user)})
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Error ' + err);
                })
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    }); 
});

/* update user info by userName */
app.put('/users/:userName', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOneAndUpdate({userName: req.params.userName},
        {$set: {
            userName: req.body.userName,
            password: req.body.password,
            email: req.body.email,
            birthDate: req.body.birthDate
        }
    },
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

/* add a new movie to user's top movie list */
app.post('/users/:userName/myMovies/:movieId', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOneAndUpdate({userName: req.params.userName}, 
        {$push: {
            movieList: req.params.movieId
            }
        },
        {new: true},
        (err, updatedUser) => {
            if (err) {
                console.errer(err);
                res.status(500).send('Error ' + err);
            } else {
                res.json(updatedUser);
            }
        });
}); 

/* delete movie from user's top movie list by id */
app.delete('/users/:userName/myMovies/:movieId', passport.authenticate('jwt', {session:false}), (req, res) => {
    Users.findOneAndUpdate({userName: req.params.userName},
        {$pull: {
            movieList: req.params.movieId
        }},
        {new: true},
        (err, updatedUser) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

/* delete user by userName */
app.delete('/users/:userName', passport.authenticate('jwt', {session:false}), (req, res) => {
   Users.findOneAndRemove({userName: req.params.userName})
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.userName + ' was not found.');
            } else {
                res.status(200).send(req.params.userName + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});  


app.use(express.static('public'));

/*error handler*/
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
    console.log('Listening on Port ' + port);
});