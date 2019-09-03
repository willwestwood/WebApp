import express from 'express';
import bodyParser from 'body-parser';

var users = require('./models/users')
var notes = require('./models/notes')
var logger = require('morgan');
var jwt = require('jsonwebtoken');

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('superSecret', "success is inevitable");
var router = express.Router();

router.post('/authenticate', function(req, res) {
    let username = req.body.user;
    let password = req.body.password;
    let isUserFound = false;
    let foundUser = {};

    users.authenticate(username, password).then(function(obj) {
      if (obj.length > 0) {
        let token = jwt.sign(foundUser, app.get('superSecret'), {
            expiresIn: 30 * 60 // expires in 24 hours
        });
        console.log(token);
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
        });
      }
      else {
        if(obj instanceof Error) {
          res.json({
              success: false,
              message: obj.message
          });
        }
        else {
          res.json({
              success: false,
              message: 'Could not authenticate'
          });
        }
      }
    })
});

//middleware
router.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        if(req._parsedUrl.pathname == '/register') {
          next()
          return
        }
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

router.get('/test', function(req, res) {
    //console.log(User);
    return res.json({
        status: 'OK',
        msg: "you are authenticated and all set to consume our services."
    });

});

// get
router.get('/users', (req, res) => {
  users.get({
    id: req.query.id,
    firstName: req.query.firstName,
    secondName: req.query.secondName,
    emailAddress: req.query.emailAddress,
    isAdmin: req.query.isAdmin
  })
  .then(function(obj) {
    res.status(200).send({
      success: 'true',
      message: 'retrieved successfully',
      users: obj
    })
  })
  .catch(err => res.status(200).send({
    success: 'false',
    message: 'not retrieved',
    users: err
  }));
});

router.get('/notes', (req, res) => {
  notes.get({
    id: req.query.id,
    contactId: req.query.contactId,
    userId: req.query.userId,
    note: req.query.note,
    updatedAt: req.query.updatedAt
  })
  .then(function(obj) {
    res.status(200).send({
      success: 'true',
      message: 'retrieved successfully',
      notes: obj
    })
  })
  .catch(err => res.status(200).send({
    success: 'false',
    message: 'not retrieved',
    notes: err
  }));
});

router.post('/notes', (req, res) => {
  notes.add({
    message: req.query.note,
    userId: req.query.userId,
    contactId: req.query.contactId
  })
  .then(function(obj) {
    res.status(200).send({
      success: 'true',
      message: 'added successfully',
      obj: obj
    })
  })
  .catch(err => res.status(200).send({
    success: 'false',
    message: 'error',
    notes: err.message
  }));
});

router.post('/register', (req, res) => {
  users.add({
    emailAddress: req.query.emailAddress,
    password: req.query.password,
    firstName: req.query.firstName,
    secondName: req.query.secondName,
    isAdmin: true
  })
  .then(function(obj) {
    res.status(200).send({
      success: 'true',
      message: 'registered successfully',
      obj: obj
    })
  })
  .catch(err => res.status(200).send({
    success: 'false',
    message: 'error',
    notes: err.message
  }));
});

router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

app.use('/api', router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
