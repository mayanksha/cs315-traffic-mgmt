import express = require( 'express' );
import cors = require( 'cors' );
import httpLogger = require( 'morgan' );
import bodyParser = require( 'body-parser' );
import assert = require( 'assert' );
import passport = require( 'passport' );
import mongoose = require( 'mongoose' );

import { PassportConfig } from './config/passport';
import { NextFunction, Request, Response } from 'express';

const app = express();
const env_PORT = Number.parseInt(process.env.SERVER_PORT || "8000");

// Schemas
import { UserSchema } from './schemas/user';

// Models 
import { IUserModel } from './models/user';

let connection : mongoose.Connection = mongoose.createConnection('mongodb://localhost/local',
  {useNewUrlParser: true});

const UserModel = connection.model<IUserModel>('UserModel', UserSchema);

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

PassportConfig.setupPassport(passport, UserModel);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello!");
  res.end();
})

app.post("/signup", (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local-signup', { session: false }, (err: Error, user: IUserModel, info: any) => {
    if (err) { 
      res.status(401);
      res.end();
      return next(err);
    }
    // User already exists, so send 409 Conflict
    if (!user) {
      res.status(409);
      res.end();
      return;
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      res.status(200);
      res.end();
    });
  }) (req, res, next);
})

app.post("/signin", 
  passport.authenticate('local-signin'),
  (req: Request, res: Response, next: NextFunction) => {
    console.log(req.body);
    res.status(200);
    res.end();
  }
)

app.listen(env_PORT, (err) => { 
  if (err) {
    throw err;
  }
  console.log("Server listening on " + env_PORT);
});

