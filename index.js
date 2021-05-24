const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [
    { 
    'title': 'Fear and Loathing in Las Vegas',
    'director': 'Terry Gilliam',
    'year': '1998',
    'genre': ['Comedy', 'Drama']
},
{ 
    'title': 'The Matrix',
    'director': 'The Wachowski Brothers',
    'year': '1999',
    'genre': ['Action', 'Thriller']
},
{ 
    'title': 'There Will Ee Blood',
    'director': 'Paul Thomas Anderson',
    'year': '2007',
    'genre': ['Drama', 'Thriller']
},
{ 
    'title': 'Shaun of the Dead',
    'director': 'Edgar Wright',
    'year': '2004',
    'genre': ['Comedy', 'Horror']
},
{ 
    'title': 'Tropic Thunder',
    'director': 'Ben Stiller',
    'year': '2008',
    'genre': ['Comedy', 'Action']
},
{ 
    'title': 'Shutter Island',
    'director': 'Martin Scorsese',
    'year': '2010',
    'genre': ['Thriller', 'Mystery']
},
{ 
    'title': 'Raiders of the Lost Ark',
    'director': 'Steven Spielberg',
    'year': '1981',
    'genre': ['Action', 'Adventure', 'Thriller']
},
{ 
    'title': 'The Shining',
    'director': 'Stanley Kubrick',
    'year': '1980',
    'genre': ['Horror', 'Suspense']
},
{ 
    'title': 'The Proposition',
    'director': 'John Hillcoat',
    'year': '2005',
    'genre': ''
},
{ 
    'title': 'Birdman or (The Unexpected Virtue of Ignorance)',
    'director': 'Alejandro G. Iñárritu',
    'year': '2014',
    'genre': ['comedy', 'drama']
},
];
/*requests to navigate the site*/ 
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

app.get('/', (req, res) => {
    res.send('Welcome to quikFlix');
});

app.use(express.static('public'));

/*error handler*/
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(8080);