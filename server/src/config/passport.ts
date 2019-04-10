import { Model } from 'mongoose';
import { PassportStatic } from 'passport';
import { Strategy, IStrategyOptions, VerifyFunction } from 'passport-local';
import { IUserModel } from '../models/user';
import localStrategy = require('passport-local');

export class PassportConfig {

  static setupPassport(passport: PassportStatic, model: Model<IUserModel>) : void {
    const options: localStrategy.IStrategyOptions = {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: false 
    };

    const checkSignIn: localStrategy.VerifyFunction = 
    function(email: string, password: string, done) {
      process.nextTick(() => {
        model.findOne({ email: email }, function (err, user: IUserModel) {
          if (err) { return done(err); }
          if (!user) { return done(null, false); }
          if (!user.comparePassword(password)) { return done(null, false); }
          return done(null, user);
        });
      })
    }

    const checkSignUp: localStrategy.VerifyFunction = 
    (email: string, password: string, done) => {
      process.nextTick(() => {
        model.findOne({ email: email }, (err, user: IUserModel) => {
          if (err) {
            return done(err);
          }
          if (user) { 
            return done(err, null);
          }
          else {
            let newUser = new model();
            newUser.email = email;
            newUser.password = newUser.genHashSync(password);
            newUser.save((err) => done(err, newUser));
            return done(err, newUser);
          }
        });
      })
    }
    passport.serializeUser<IUserModel, string> (function(user: IUserModel, done) {
      console.log(user);
      done(null, user._id);
    });

    passport.deserializeUser((id, cb: (err: Error | null, user?: IUserModel | null) => void) => {
      model.findById(id, (err, user) => {
        if (err) return cb(err);
        cb(null, user);
      })
    });

    passport.use('local-signin', new localStrategy.Strategy(options, checkSignIn));
    passport.use('local-signup', new localStrategy.Strategy(options, checkSignUp));

  }
}
