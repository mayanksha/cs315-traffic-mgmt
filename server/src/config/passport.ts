import { Model } from 'mongoose'
import { PassportStatic } from 'passport'
import { Strategy, IStrategyOptions, VerifyFunction } from 'passport-local'
import { IUserModel } from '../models/user'
import localStrategy = require('passport-local')
import { AuthLevels } from '../controllers/accounts'
import { Request } from 'express'

export class PassportConfig {
  static setupPassport(passport: PassportStatic, model: Model<IUserModel>): void {
    const options: localStrategy.IStrategyOptionsWithRequest = {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    }

    const checkSignIn: localStrategy.VerifyFunctionWithRequest = 
    (req: Request, email: string, password: string, done) => {
      console.log(req.body);
      process.nextTick(() => {
        model.findOne({ email: email }, function(err, user: IUserModel) {
          if (err) {
            return done(err)
          }
          if (!user) {
            return done(null, false);
          }
          if (!user.comparePassword(password)) {
            return done(null, false);
          }

          // Set the authLevel from the database here only, so as to avoid performing a 
          // second DB I/O in the next middleware to set the cookie's authLevel
          (req as any).locals = {};
          (req as any).locals.authLevel = user.authLevel;

          if (typeof req.body.authRequested === "number" && (user.authLevel === req.body.authRequested))
            return done(null, false);
          return done(null, user)
        })
      })
    }

    const checkSignUp: localStrategy.VerifyFunctionWithRequest = 
    (req: Request, email: string, password: string, done) => {
      process.nextTick(() => {
        model.findOne({ email: email }, (err, user: IUserModel) => {
          if (err) {
            return done(err)
          }
          if (user) {
            return done(err, null)
          } else {
            let newUser = new model()
            newUser.email = email
            newUser.password = newUser.genHashSync(password)
            newUser.authLevel = AuthLevels.USER_CITIZEN
            newUser.save(err => done(err, newUser))
            return done(err, newUser)
          }
        })
      })
    }
    passport.serializeUser<IUserModel, string>(function(user: IUserModel, done) {
      console.log(user)
      done(null, user._id)
    })

    passport.deserializeUser((id, cb: (err: Error | null, user?: IUserModel | null) => void) => {
      model.findById(id, (err, user) => {
        if (err) return cb(err)
        cb(null, user)
      })
    })

    passport.use('local-signin', new localStrategy.Strategy(options, checkSignIn))
    passport.use('local-signup', new localStrategy.Strategy(options, checkSignUp))
  }
}
