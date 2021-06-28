const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js');
const { title, send } = require('process');

const Movies = Models.Movie;
const Users = Models.User;
const app = express();

mongoose.connect('mongodb://localhost:27017/quikFlix', {useNewUrlParser: true, useUnifiedTopology: true});

app.use(morgan('common'));

/*requests to navigate the site*/ 
app.get('/', (req, res) => {
    res.send('Welcome to quikFlix');
});

/* get list of all movies */
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
});    

/* get list of users */
app.get('/users', (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error ' + err);
        });
})

/* get user's list of top movies */
app.get('/users/:userName/myMovies', (req, res) => {
    Users.findOne({username: req.params.username})
    .then((movieList) => {
        res.json(movieList);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err)
    }); 
});

/* get info on movie by title */
app.get('/movies/:title', (req, res) => {
    Movies.findOne({title: req.params.title})
    .then((movie) => {
        res.json(movie);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

/* get list of genres */
app.get('/genres', (req, res) => {
    Movies.find({'genre': {}})
    .then((genre) => {
        res.json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

/* get genre info by name */
app.get('/genres/:genre', (req, res) => {
    Movies.findOne({'genre.genrename': req.params.genre})
    .then((genre) => {
        res.json(genre);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

/* get list of directors */
app.get('/directors', (req, res) => {
    Movies.find({director: req.params.director})
    .then((directors) => {
        res.json(directors);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error ' + err);
    });
});

/* get info on director */
app.get('/directors/:name', (req, res) => {
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
app.post('/users', (req, res) => {
    Users.findOne({username: req.params.username})
    .then((user) => {
        if (user) {
            return res.status(400).send(req.body.username + 'already exists');
        } else {
            Users
                .create({
                    username: 'req.body.username',
                    password: 'req.body.password',
                    email: 'req.body.email',
                    birth_date: req.body.birth_date
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

/* update user info by username */
app.put('/users/:username', (req, res) => {
    Users.findOneAndUpdate({username: req.params.username},
        {$set: {
            username: 'req.body.username',
            password: 'req.body.password',
            email: 'req.body.email',
            birth_date: req.body.birth_date
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
app.post('/users/:username/myMovies/:movieId', (req, res) =>{
    Users.findOneAndUpdate({username: req.params.username}, 
        {
            $push: {movieList: 'req.params.movieId'}
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
app.delete('/users/:username/myMovies/:movieId', (req, res) => {
    Users.findOneAndUpdate({username: req.params.username},
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

/* delete user by username */
app.delete('/users/:username', (req, res) => {
   Users.findOneAndRemove({username: req.params.username})
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.username + ' was not found.');
            } else {
                res.status(200).send(req.params.username + ' was deleted.');
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



app.listen(8080);