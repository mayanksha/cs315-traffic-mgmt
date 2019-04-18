import { Model } from 'mongoose'
import { IUserModel } from '../models/user'
import { NextFunction, Request, Response } from 'express'

export enum AuthLevels {
  USER_ADMIN = 1 << 0,
  USER_RTO = 1 << 1,
  USER_POLICE = 1 << 2,
  USER_CITIZEN = 1 << 3,
}

/*
 * Controller for Authorization checking and
 * granting different Auth Levels
 *
 **/

export class AccountCtrl {
  private UserModel: Model<IUserModel>

  constructor(model: Model<IUserModel>) {
    this.UserModel = model
  }

  public checkAdmin(req: Request, res: Response, next: NextFunction): void {
    if (req.user.authLevel & AuthLevels.USER_ADMIN) {
      next()
    } else {
      console.log('[DEBUG] checkAdmin called by -')
      console.log(req.user)
      res.sendStatus(403)
      return
    }
  }

  public checkRTO(req: Request, res: Response, next: NextFunction): void {
    if ((req.user.authLevel & AuthLevels.USER_RTO) | (req.user.authLevel & AuthLevels.USER_ADMIN)) {
      next()
    } else {
      console.log('[DEBUG] checkRTO called by -')
      console.log(req.user)
      res.sendStatus(403)
      return
    }
  }
  public checkPolice(req: Request, res: Response, next: NextFunction): void {
    if ((req.user.authLevel & AuthLevels.USER_POLICE) | (req.user.authLevel & AuthLevels.USER_ADMIN)) {
      next()
    } else {
      console.log('[DEBUG] checkPolice called by -')
      console.log(req.user)
      res.sendStatus(403)
      return
    }
  }
  public checkPoliceOrRTO(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    if (
      (req.user.authLevel & AuthLevels.USER_POLICE) |
      (req.user.authLevel & AuthLevels.USER_RTO) | (req.user.authLevel & AuthLevels.USER_ADMIN)
    ) {
      next()
    } else {
      console.log('[DEBUG] checkPoliceOrRTO called by -')
      console.log(req.user)
      res.sendStatus(403)
      return
    }
  }
  public checkLogin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      console.log(req.user);
      next()}
    else res.sendStatus(401)
  }

  public SignOut = (req: Request, res: Response) => {
    req.logout()
    res.sendStatus(200)
  }
}
