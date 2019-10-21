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

//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-access-token');

  next();
}

//app.configure(function() {
  //app.use(express.bodyParser());
  //app.use(express.cookieParser());
  //app.use(express.session({ secret: 'cool beans' }));
  //app.use(express.methodOverride());
  app.use(allowCrossDomain);
  //app.use(app.router);
  //app.use(express.static(__dirname + '/public'));
//});

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

// companies
router.get('/companies', routes.companies.get);
router.post('/companies', routes.companies.add);

// contacts
router.get('/contacts', routes.contacts.get);
router.post('/contacts', routes.contacts.add);

// phone numbers
router.get('/phoneNumbers', routes.phoneNumbers.get);
router.post('/phoneNumbers', routes.phoneNumbers.add);

// default
router.use(function(req, res, next) {
    console.log('Something is happening.');
    next();
});

// prepend 'api' to routes
app.use('/api', router);

// start server
app.listen(PORT, () => {
  console.log('server running on port ${PORT}')
});

routes.initialise()