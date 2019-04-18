import express = require('express')
import cors = require('cors')
import httpLogger = require('morgan')
import bodyParser = require('body-parser')
import assert = require('assert')
import passport = require('passport')
import mongoose = require('mongoose')
import session = require('express-session')

import { PassportConfig } from './config/passport'
import { NextFunction, Request, Response } from 'express'

const app = express()
const env_PORT = Number.parseInt(process.env.SERVER_PORT || '8000')

// Schemas
import { UserSchema } from './schemas/user'
import { ChallanSchema } from './schemas/challan'
import { CitizenSchema } from './schemas/citizen'
import { PoliceSchema } from './schemas/police'
import { TrafficSchema } from './schemas/traffic'
import { VehicleSchema } from './schemas/vehicle'
/*import { InsuranceSchema } from './schemas/insurance'*/

// Models
import { IUserModel } from './models/user'
import { IChallanModel } from './models/challan'
import { ICitizenModel } from './models/citizen'
import { IPoliceModel } from './models/police'
import { ITrafficModel } from './models/traffic'
import { IVehicleModel } from './models/vehicle'
/*import { IInsuranceModel } from './models/insurance'*/

// Controllers
import { AccountCtrl } from './controllers/accounts'

let connection: mongoose.Connection = mongoose.createConnection('mongodb://localhost/local', {
  useNewUrlParser: true,
})

const UserModel = connection.model<IUserModel>('UserModel', UserSchema)
const ChallanModel = connection.model<IChallanModel>('ChallanModel', ChallanSchema)
const CitizenModel = connection.model<ICitizenModel>('CitizenModel', CitizenSchema)
const PoliceModel = connection.model<IPoliceModel>('PoliceModel', PoliceSchema)
const TrafficModel = connection.model<ITrafficModel>('TrafficModel', TrafficSchema)
const VehicleModel = connection.model<IVehicleModel>('VehicleModel', VehicleSchema)
/*const InsuranceModel = connection.model<IInsuranceModel>('InsuranceModel', InsuranceSchema)*/

const sessionOptions: session.SessionOptions = {
  secret: 'foobarfoobarfoobar',
  resave: false,
  saveUninitialized: false,
}

app.use(bodyParser.json())
app.use(session(sessionOptions))
app.use(passport.initialize())
app.use(passport.session())
app.use(cors())
app.use(httpLogger('dev'))

PassportConfig.setupPassport(passport, UserModel)

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello!')
  res.end()
})

let accController: AccountCtrl = new AccountCtrl(UserModel)

app.get(
  '/foobar',
  accController.checkLogin,
  accController.checkAdmin,
  (req: Request, res: Response, next: NextFunction) => {
    res.send(req.user)
    res.end()
  }
)

function getAllChallanHandler(req: Request, res: Response, next: NextFunction): void {
  let challanPromise: Promise<IChallanModel[]> = ChallanModel.find({}).exec();
  challanPromise
  .then((allChallan) => {
    res.send(allChallan);
  })
  .catch((err) => {
    res.sendStatus(500);
    console.error(err);
  })
}

function createChallanHandler(req: Request, res: Response, next: NextFunction): void {
  // Assertions to check whether it isn't a Bad Request
  assert(typeof req.body.license !== "undefined");
  assert(typeof req.body.fineAmount !== "undefined");
  assert(typeof req.body.vehicleNo !== "undefined");
  assert(typeof req.body.policeOfficer !== "undefined");
  assert(typeof req.body.dueDate !== "undefined");
  assert(typeof req.body.coordinates !== "undefined");
  /*assert(
   *  typeof req.body.coordinates !== "undefined" &&
   *  typeof req.body.coordinates.latitude !== "undefined" &&
   *  typeof req.body.coordinates.longitude !== "undefined"
   *);*/
  let storeCitizen: ICitizenModel;

  // The _id field of CitizenSchema correspods to the 
  // License Number of that person
  if (!mongoose.Types.ObjectId.isValid(req.body.license)) {
    res.sendStatus(400);
    return;
  }
  let licensePromise: Promise<ICitizenModel | null> = 
  CitizenModel.findOne({ _id: req.body.license }).exec();

  licensePromise
  .then((citizen: ICitizenModel | null ): ICitizenModel | PromiseLike<any> => {
    console.log(citizen);
    if (!citizen) {
      let err = new Error();
      err.message = `Citizen ${citizen} doesn't exists in DB!`;
      err.name = "E_NOT_EXISTS";
      return Promise.reject(err);
    }
    else {
      storeCitizen = citizen;
      return citizen;
    };
  })
  // TODO: Atomicity Issue here, we need to fix this by removing the challan schema and adding a
  // Challan field in the Citizen Schema. MongoDB doesn't support transactions (or if 
  // it does, then they need database replicas to be working)
  //
  // There's no way to rollback (unless you explicity delete which isn't Atomic either) 
  // once your newChallan.save() has suceeded.

  .then((citizen: ICitizenModel | null ): PromiseLike<IChallanModel> => {
    if (citizen) {
      let newChallan = new ChallanModel();
      newChallan.license = citizen._id;
      newChallan.fineAmount = req.body.fineAmount;
      newChallan.vehicleNo = req.body.vehicleNo;
      newChallan.policeOfficer = req.body.policeOfficer;
      newChallan.dueDate = req.body.dueDate;
      newChallan.coordinates.longitude = req.body.coordinates.latitude;
      newChallan.coordinates.longitude = req.body.coordinates.longitude;
      return newChallan.save();
    }
    else return Promise.reject(new Error("Citizen Not Found in DB!"));
  })
  // .then((newChallan: IChallanModel) => {
  //   console.log(newChallan);
  //   storeCitizen.offences.Unpaid.push(newChallan._id);
  //   return storeCitizen.save();
  // })
  .then((newChallan: IChallanModel) => {
    console.log(newChallan);
    res.sendStatus(200);
  })
  .catch((err) => {
    if ( err.name === "E_NOT_EXISTS" )
      res.sendStatus(404);
    else
      res.sendStatus(500);
    console.error(err);
  })
}

function createCitizenHandler(req: Request, res: Response, next: NextFunction): void {
  // Assertions to check whether it isn't a Bad Request
  assert(typeof req.body.name !== "undefined");
  assert(typeof req.body.personal.address !== "undefined");
  assert(typeof req.body.personal.phoneNumber !== "undefined");
  assert(typeof req.body.personal.email !== "undefined");
  assert(typeof req.body.personal.license !== "undefined");
  assert(typeof req.body.registeredVehicleNos !== "undefined");
  assert(typeof req.body.licenseDetails.LType !== "undefined");

  let citizenExistPromise: Promise<ICitizenModel | null> = 
  CitizenModel.findOne({ email: req.body.license }).exec();
  citizenExistPromise
  .then((citizen: ICitizenModel | null ): any | Promise<ICitizenModel>  => {
    if (citizen) {
      let err = new Error();
      err.message = `Citizen ${citizen} already exists!`;
      err.name = "E_EXISTS";
      return Promise.reject(err);
    }
    else return citizen;
  })
  .then( (citizen: ICitizenModel | null ): PromiseLike<ICitizenModel> => {
    if(!citizen) {
      let newCitizen = new CitizenModel();
      newCitizen.name = req.body.name;
      newCitizen.personal.address = req.body.personal.address;
      newCitizen.personal.phoneNumber = req.body.personal.phoneNumber;
      newCitizen.personal.email = req.body.personal.email;
      //newCitizen.personal.license = req.body.personal.license;
      newCitizen.registeredVehicleNos = req.body.registeredVehicleNos;
      newCitizen.licenseDetails.LType = req.body.licenseDetails.LType;
      return newCitizen.save();
    }
    else return Promise.reject(new Error("Citizen Already Exists In DB!")); 
  })
  .then((newCitizen: ICitizenModel) => {
    console.log(newCitizen);
    res.sendStatus(200);
  })
  .catch((err) => {
    if ( err.name === "E_EXISTS" )
      res.sendStatus(409);
    else
      res.sendStatus(500);
    console.error(err);
  })
}
function updateAuthLevelHandler(req: Request, res: Response, next: NextFunction) { 
  assert(typeof req.body.email !== "undefined");
  assert(typeof req.body.authLevel !== "undefined");

  UserModel.findOne({ email: req.body.email }).exec()
    .then((user: IUserModel | null) => {
      if (user) {
        user.updateOne({ email: req.body.email }, { authLevel: req.body.authLevel });
        return user.save();
      }
      else {
        return Promise.reject(new Error(`User ${req.body.email} doesn't exists!`));
      }
    })
    .then((ret) => {
      console.log(ret);
      res.sendStatus(200);
    })
    .catch(err => { 
      res.sendStatus(500);
      console.error(err) 
    });
};
function registerVehicleHandler(req: Request, res: Response, next: NextFunction) {
  assert(typeof req.body.vehicleNo !== "undefined");
  assert(typeof req.body.vehicleType !== "undefined");
  assert(typeof req.body.vehicleColor !== "undefined");
  assert(typeof req.body.VINNo !== "undefined");
  assert(typeof req.body.licenseNo !== "undefined");
  assert(typeof req.body.registeredTo !== "undefined");
  // TODO: Handle Insurance too

  // TODO: CHeck whether such a license exists or not?
  let registerPromise: Promise<IVehicleModel | null> = VehicleModel.findOne({ VINNo: req.body.VINNo }).exec();
  registerPromise 
    .then((vehicle: IVehicleModel | null): PromiseLike<IVehicleModel> => {
      if (vehicle) {
        res.status(409);
        let err = new Error();
        err.message = "Vehicle Found in Database";
        err.name = "E_EXISTS";
        return Promise.reject(err);
      }
      else {
        const newVehicle = new VehicleModel();
        newVehicle.vehicleNo = req.body.vehicleNo;
        newVehicle.vehicleType = req.body.vehicleType;
        newVehicle.vehicleColor = req.body.vehicleColor;
        newVehicle.VINNo = req.body.VINNo;
        newVehicle.registeredTo = req.body.registeredTo;
        newVehicle.PAN_No = (req.body.PAN_No === "undefined")? null: req.body.PAN_No;

        // TODO: Check error here
        if (typeof req.body.insurance != "undefined") {
          newVehicle.insurance.expiresAt = req.body.insurance.expiresAt;
          newVehicle.insurance.insuredFrom = req.body.insurance.insuredFrom;
          newVehicle.insurance.policyNo = req.body.insurance.policyNo;
          newVehicle.insurance.policyScheme = req.body.insurance.policyScheme;
        }
        return newVehicle.save();
      }
    })
    .then((vehicle: IVehicleModel) => {
      res.status(200).send(vehicle);
    })
    .catch((err: Error) => {
      if ( err.name === "E_EXISTS" )
        res.sendStatus(409);
      else
        res.sendStatus(500);
      console.error(err);
    })
}

app.get('/getChallanById');
app.get('/getChallanByUser');
app.get('/allChallan', 
  accController.checkLogin,
  accController.checkRTO,
  getAllChallanHandler
)
app.post('/createChallan', 
  accController.checkLogin,
  accController.checkRTO,
  createChallanHandler 
)
app.post('/createCitizenLicense',
  accController.checkLogin,
  accController.checkRTO,
  createCitizenHandler
)
app.post('/registerVehicle',
  accController.checkLogin,
  accController.checkRTO,
  registerVehicleHandler
)
app.post('/updateAuthLevel',
  updateAuthLevelHandler
);
// Route to Sign any user out. If the user is not logged in, 
// it automatically returns 401 Unauthorized

app.post('/signup', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local-signup', { session: false }, (err: Error, user: IUserModel, info: any) => {
    if (err) {
      res.status(401)
      res.end()
      return next(err)
    }
    // User already exists, so send 409 Conflict
    if (!user) {
      res.status(409)
      res.end()
      return
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err)
      }
      res.status(200)
      res.end()
    })
  })(req, res, next)
})

app.post('/signin', passport.authenticate('local-signin'), (req: Request, res: Response, next: NextFunction) => {
  res.status(200)
  res.end()
})

app.get('/signout', accController.checkLogin, accController.SignOut);
app.use('/*', (err, req: Request, res: Response, next: NextFunction) => {
  // Assertions errors are wrong user inputs
  console.error(err);
  if(err.code === 'ERR_ASSERTION'){
    // Bad HTTP Request
    res.sendStatus(400);
  }
  else {
    // Internal Server Error 
    res.status(500);
    res.end('500 - INTERNAL SERVER ERROR!');
  }
});

app.listen(env_PORT, err => {
  if (err) {
    console.error(err)
  }
  console.log('Server listening on ' + env_PORT)
})
