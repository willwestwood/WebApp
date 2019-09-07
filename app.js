import express from 'express';
import bodyParser from 'body-parser';

var routes = require('./routes');
var logger = require('morgan');
var unless = require('express-unless');

// Set up the express app
const PORT = 3000;
const app = express();
var router = express.Router();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

// authentication
routes.authentication.validateToken.unless = unless;
router.use(routes.authentication.validateToken.unless({
    path: [
      '/api/register',
      '/api/authenticate',
      { url: '/', methods: ['GET', 'PUT']  }
    ]
  })
);
router.post('/authenticate', routes.authentication.authenticate);

// misc
router.get('/test', routes.test);

// users
router.get('/users', routes.users.get);
router.post('/register', routes.users.add);

// notes
router.get('/notes', routes.notes.get);
router.post('/notes', routes.notes.add);

// default
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// prepend 'api' to routes
app.use('/api', router);

// start server
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
