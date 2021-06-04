const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    uuid = require('uuid');
const { title, send } = require('process');

const app = express();

app.use(morgan('common'));

let directors = [
{
    name: 'Stanley Kubrik',
    birthPlace: 'Manhattan, NY',
    birthYear: '1928',
    deathYear: '1999'
},
{
    name: 'Terry Gilliam',
    birthPlace: 'Minneapolis, MN',
    birthYear: '1940',
    deathYear: ''
}
];

let genres = [
{
    genre: 'Action',
    description: 'Genre in which the characters are put into situations of harm, violence, and chaos.'
}, 
{
    genre: 'Thriller',
    description: 'Genre which invokes the feeling of suspense and alarm.'
},  
{
    genre: 'Comedy',
    description: 'Genre of film using humor as means of entertainment.'
}, 
{
    genre: 'Drama',
    description: 'Genre of stories intended to be of a more serious, sometimes heartfelt nature.'
},
{
    genre: 'Horror',
    description: 'Genre of film that uses suspense and mood to create the feeling of fear.'
},
{
    genre: 'Mystery',
    description: 'Genre of film that has a problem requiring a solution that must be solved.'
}
];

let users = [
{
    id: 1,
    userName: 'Tim',
    email: 'timmanews@gmail.com',
    topMovies: [
        { 
        title: 'Fear and Loathing in Las Vegas',
        director: 'Terry Gilliam',
        year: '1998',
        genre: ['Comedy', 'Drama']
    },
    { 
        title: 'The Matrix',
        director: 'The Wachowski Brothers',
        year: '1999',
        genre: ['Action', 'Thriller']
    },
    { 
        title: 'There Will Ee Blood',
        director: 'Paul Thomas Anderson',
        year: '2007',
        genre: ['Drama', 'Thriller']
    },
    { 
        title: 'Shaun of the Dead',
        director: 'Edgar Wright',
        year: '2004',
        genre: ['Comedy', 'Horror']
    },
    { 
        title: 'Tropic Thunder',
        director: 'Ben Stiller',
        year: '2008',
        genre: ['Comedy', 'Action']
    },
    { 
        title: 'Shutter Island',
        director: 'Martin Scorsese',
        year: '2010',
        genre: ['Thriller', 'Mystery']
    },
    { 
        title: 'Raiders of the Lost Ark',
        director: 'Steven Spielberg',
        year: '1981',
        genre: ['Action',  'Thriller']
    },
    { 
        title: 'The Shining',
        director: 'Stanley Kubrick',
        year: '1980',
        genre: ['Horror', 'Thriller']
    },
    { 
        title: 'The Proposition',
        director: 'John Hillcoat',
        year: '2005',
        genre: ['Drama', 'Action']
    },
    { 
        title: 'Birdman or (The Unexpected Virtue of Ignorance)',
        director: 'Alejandro G. Iñárritu',
        year: '2014',
        genre: ['Comedy', 'Drama']
    },
    ]
}
];


let allMovies = [
    { 
        title: 'Fear and Loathing in Las Vegas',
        director: 'Terry Gilliam',
        year: '1998',
        genre: ['Comedy', 'Drama']
    },
    { 
        title: 'The Matrix',
        director: 'The Wachowski Brothers',
        year: '1999',
        genre: ['Action', 'Thriller']
    },
    { 
        title: 'There Will Ee Blood',
        director: 'Paul Thomas Anderson',
        year: '2007',
        genre: ['Drama', 'Thriller']
    },
    { 
        title: 'Shaun of the Dead',
        director: 'Edgar Wright',
        year: '2004',
        genre: ['Comedy', 'Horror']
    },
    { 
        title: 'Tropic Thunder',
        director: 'Ben Stiller',
        year: '2008',
        genre: ['Comedy', 'Action']
    },
    { 
        title: 'Shutter Island',
        director: 'Martin Scorsese',
        year: '2010',
        genre: ['Thriller', 'Mystery']
    },
    { 
        title: 'Raiders of the Lost Ark',
        director: 'Steven Spielberg',
        year: '1981',
        genre: ['Action',  'Thriller']
    },
    { 
        title: 'The Shining',
        director: 'Stanley Kubrick',
        year: '1980',
        genre: ['Horror', 'Thriller']
    },
    { 
        title: 'The Proposition',
        director: 'John Hillcoat',
        year: '2005',
        genre: ['Drama', 'Action']
    },
    { 
        title: 'Birdman or (The Unexpected Virtue of Ignorance)',
        director: 'Alejandro G. Iñárritu',
        year: '2014',
        genre: ['Comedy', 'Drama']
    },
];

/*requests to navigate the site*/ 
app.get('/', (req, res) => {
    res.send('Welcome to quikFlix');
});

/* get list of all movies */
app.get('/movies', (req, res) => {
    res.json(allMovies);
});    

/* get list of users */
app.get('/users', (req, res) => {
    res.json(users);
})

/* get user's list of top movies */
app.get('/users/:userName/myMovies', (req, res) => {
    let user = users.find((user) => {
        return user.userName === req.params.userName;
    });
    if (user) {
        let myMovies = user.topMovies;
        res.json(myMovies);
    } else {
        res.status(400).send('User ' + req.params.userName + ' not found.');
    }    
});

/* get info on movie by title */
app.get('/movies/:title', (req, res) => {
    res.json(allMovies.find((movie) => {
        return movie.title === req.params.title
    }));
});

/* get list of genres */
app.get('/genres', (req, res) => {
    res.json(genres);
});

/* get genre info by name */
app.get('/genres/:genre', (req, res) => {
    res.json(genres.find((type) => {
        return type.genre === req.params.genre
    }));
});

/* get list of directors */
app.get('/directors', (req, res) => {
    res.json(directors);
});

/* get info on director */
app.get('/directors/:name', (req, res) => {
    res.json(directors.find((director) => {
        return director.name === req.params.name
    }));
});

/* create a new user */
app.post('/users/:username/:email', (req, res) => {
    let newUser = req.params;

    if (!newUser.userName && !newUser.email) {
        const message = 'An username and email is required.'
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        newUser.topMovies = [];
        users.push(newUser);
        res.status(200).send(newUser);
    }
});

/* update username or email using id to find user */
app.put('/users/:id/:userName/:email', (req, res) => {
    let user = users.find((user) => {
        return user.id === +req.params.id
    });

    if (user) {
        user.userName = req.params.userName;
        user.email = req.params.email;
        res.status(200).send('Your username and email have been updated to ' + req.params.userName + ' & '
        + req.params.email + '.');
    } else {
        res.status(400).send('User with ' + req.params.userName + ' username not found.');
    }
});

/* add a new movie to user's top movie list */
app.post('/users/:userName/myMovies/:title/:director/:year/:genre', (req, res) =>{
    let user = users.find((user) => {
        return user.userName === req.params.userName
    });
    let newMovie = {};

   if (user && req.params) {
       newMovie.title = req.params.title;
       newMovie.director = req.params.director;
       newMovie.year = req.params.year;
       newMovie.genre = req.params.genre.split(' ');
       user.topMovies.push(newMovie);
       res.status(200).send('Movie has been added')
    } else {
       res.status(400).send('Movie could not be added. Make sure you are using the correct username.') 
    } 
}); 

/* delete movie from user's top movie list by title */
app.delete('/users/:userName/myMovies/:title', (req, res) => {
    let user = users.find((user) => {
        return user.userName === req.params.userName
    });
    let movie = user.topMovies.find((movie) => {
        return movie.title === req.params.title
    });

    if (user && movie) {
        topMovies = user.topMovies.filter((obj) => {
            return obj.title !== req.params.title
        });
        res.status(201).send(req.params.title + ' was deleted from your list.')
    }
});

/* delete user by username */
app.delete('/users/:userName', (req, res) => {
    let user = users.find((user) => {
        return user.userName === req.params.userName
    });
    if (user) {
        users = users.filter((obj) => {
            return obj.userName !== req.params.userName
        });
        res.status(201).send('User ' + req.params.userName + ' was deleted.')
    } else {
        res.status(400).send('User not found.')
    }
});    

app.use(express.static('public'));

/*error handler*/
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});



app.listen(8080);