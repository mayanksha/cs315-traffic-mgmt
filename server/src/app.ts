import express = require( 'express' );
import cors = require( 'cors' );
import httpLogger = require( 'morgan' );
import bodyParser = require( 'body-parser' );
import assert = require( 'assert' );
import passport = require('passport');
import localStrategy = require('passport-local');
import mongoose = require('mongoose');

const app = express();
import { NextFunction, Request, Response } from 'express';
const env_PORT = Number.parseInt(process.env.SERVER_PORT || "8000");


mongoose.createConnection('mongodb://localhost/local', {useNewUrlParser: true});

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello!");
  res.end();
})
passport.use(new localStrategy.Strategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  function(email, password, done) {
    const user =  {
      email: email, 
      password: password
    }
    return done(null, user);
    /*User.findOne({ username: username }, function (err, user) {
     *  if (err) { return done(err); }
     *  if (!user) { return done(null, false); }
     *  if (!user.verifyPassword(password)) { return done(null, false); }
     *  return done(null, user);
     *});*/
  }
));

// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function(user: any, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  /*db.users.findById(id, function (err, user) {
   *  if (err) { return cb(err); }
   *  cb(null, user);
   *});*/
});

app.post("/login", 
  passport.authenticate('local'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.send("Foobar");
  }
)

app.listen(env_PORT, (err) => { 
	if (err) {
		throw err;
	}
	console.log("Server listening on " + env_PORT);
});

