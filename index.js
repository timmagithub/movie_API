const express = require('express'),
    morgan = require('morgan');

const app = express();

app.use(morgan('common'));

let topMovies = [];
/*requests to navigate the site*/ 
app.get('/movies', (req, res) => {
    res.json(topMovies).send('Top 10 Movies');
});

app.get('/', (req, res) => {
    res.send('Welcome to quikFlix');
});

app.use(express.static('public'));

/*error handler*/
const bodyParser = require('body-parser'),
    methodOverride = require('method-overide');
 
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


app.listen(8080);