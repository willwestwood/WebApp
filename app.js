import express from 'express';
//import db from './db/db';
import bodyParser from 'body-parser';
//import select from './db/mysql';
var db = require('./db/mysql')
var users = require('./models/users')

var logger = require('morgan');

var crypto   = require('crypto');

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));

var jwt = require('jsonwebtoken');
app.set('superSecret', "success is inevitable");
var router = express.Router();

function hashPassword(password)
{
  var salt = crypto.createHash('sha1').update('ctechcrm').digest('hex');
  salt = salt+''+password;
  return crypto.createHash('sha1').update(salt).digest('hex');
}

router.post('/authenticate', function(req, res) {
    var username = req.body.user;
    var password = req.body.password;
    var isUserFound = false;
    var foundUser = {};

    var encPassword = hashPassword(password);

    users.authenticate(username, encPassword).then(function(obj) {
      if (obj.length > 0)
      {
        var token = jwt.sign(foundUser, app.get('superSecret'), {
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
        res.json({
            success: false,
            message: 'Authentication failed. Wrong password.'
        });
      }
    })

    // for (var i = 0; i < users.length; i++) {
    //     if (users[i].user === req.body.user) {
    //         isUserFound = true;
    //         foundUser = users[i];
    //     }
    // }
    // if (isUserFound) {
    //     if (foundUser.password == req.body.password) {
    //         var token = jwt.sign(foundUser, app.get('superSecret'), {
    //             expiresIn: 24 * 60 * 60 // expires in 24 hours
    //         });
    //         console.log(token);
    //         res.json({
    //             success: true,
    //             message: 'Enjoy your token!',
    //             token: token
    //         });
    //     } else {
    //         res.json({
    //             success: false,
    //             message: 'Authentication failed. Wrong password.'
    //         });
    //     }
    //     //res.send(foundUser);
    // } else {
    //     res.json({
    //         success: false,
    //         message: 'Authentication failed. user not found.'
    //     });
    // }
});

//middleware
router.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

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
        if(req._parsedUrl.pathname == '/register')
        {
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

// app.post('/api/users', (req, res) => {
//   if(!req.body.title) {
//     return res.status(400).send({
//       success: 'false',
//       message: 'title is required'
//     });
//   } else if(!req.body.description) {
//     return res.status(400).send({
//       success: 'false',
//       message: 'description is required'
//     });
//   }
//  const todo = {
//    id: db.length + 1,
//    title: req.body.title,
//    description: req.body.description
//  }
//  db.push(todo);
//  return res.status(201).send({
//    success: 'true',
//    message: 'todo added successfully',
//    todo
//  })
// });

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
    firstName: req.query.firstName,
    secondName: req.query.secondName
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
  db.select('notes', req.query.id)
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

router.post('/register', (req, res) => {
  var user =
  {
    emailAddress: req.query.emailAddress,
    passwordHash: hashPassword(req.query.password),
    firstName: req.query.firstName,
    secondName: req.query.secondName,
    isAdmin: true
  }

  users.add(user)
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
