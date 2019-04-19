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
import { TrafficSchema } from './schemas/traffic_signal'
import { VehicleSchema } from './schemas/vehicle'
import { AccidentSchema } from './schemas/accident'
/*import { InsuranceSchema } from './schemas/insurance'*/

// Models
import { IUserModel } from './models/user'
import { IChallanModel } from './models/challan'
import { ICitizenModel } from './models/citizen'
import { IPoliceModel } from './models/police'
import { ITrafficModel } from './models/traffic_signal'
import { IVehicleModel } from './models/vehicle'
import { IAccidentModel } from './models/accident'
/*import { IInsuranceModel } from './models/insurance'*/

// Controllers
import { AccountCtrl } from './controllers/accounts'

mongoose.Promise = Promise;
let connection: mongoose.Connection = mongoose.createConnection('mongodb://localhost/local', {
  useNewUrlParser: true,
})

const UserModel = connection.model<IUserModel>('UserModel', UserSchema)
const ChallanModel = connection.model<IChallanModel>('ChallanModel', ChallanSchema)
const CitizenModel = connection.model<ICitizenModel>('CitizenModel', CitizenSchema)
const PoliceModel = connection.model<IPoliceModel>('PoliceModel', PoliceSchema)
const TrafficModel = connection.model<ITrafficModel>('TrafficModel', TrafficSchema)
const VehicleModel = connection.model<IVehicleModel>('VehicleModel', VehicleSchema)
const AccidentModel = connection.model<IAccidentModel>('AccidentModel', AccidentSchema)
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

function getChallanByUserHandler(req: Request, res: Response, next: NextFunction): void {
  console.log(req.user);
  ChallanModel.find({"email": req.user.email})
  .then((challanList: IChallanModel[]) => {
    console.log(challanList);
    res.send(challanList);
  })
  .catch((err) => {
    res.sendStatus(404);
    console.error(err);
  })
}

//give a license numberr and get back all assosciated challans
function getChallanByIdHandler(req: Request, res: Response, next: NextFunction): void {
  //assert(typeof req.body.email !== "undefined");
  assert(typeof req.body.license !== "undefined");
  //console.log(req.user);
  if (!mongoose.Types.ObjectId.isValid(req.body.license)) {
    res.sendStatus(400);
    return;
  }
  let licensePromise: Promise<ICitizenModel | null> = 
  CitizenModel.findOne({ _id: req.body.license }).exec();
  licensePromise
  .then((citizen: ICitizenModel | null ): ICitizenModel | Promise<ICitizenModel> => {
    console.log(citizen);
    if (!citizen) {
      let err = new Error();
      err.message = `Citizen ${citizen} doesn't exists in DB!`;
      err.name = "E_NOT_EXISTS";
      return Promise.reject(err);
    }
    else {
      return citizen;
    };
  })
  .then((citizen: ICitizenModel): PromiseLike<IChallanModel[]> => {
    return ChallanModel.find({_id: req.body.license});
  })
  .then( (challanList: IChallanModel[])=> {
    console.log(challanList);
    res.send(challanList);
  })
  .catch((err) => {
    if ( err.name === "E_NOT_EXISTS" )
      res.sendStatus(404);
    else
      res.sendStatus(500);
    console.error(err);
  })
  
}


function payChallanHandler(req: Request, res: Response, next: NextFunction): void {
  assert(typeof req.body.challanId !== "undefined");
  let ChallanExistPromise: Promise<IChallanModel | null>  = 
  ChallanModel.findOneAndUpdate({_id: req.body.challanId}, {paymentStatus : true}).exec();
  ChallanExistPromise
  .then((challan: IChallanModel | null): any | Promise<IChallanModel> => {
    console.log(challan);
    if(!challan) {
      let err = new Error();
      err.message = `Challan doesn't exists in DB!`;
      err.name = "E_NOT_EXISTS";
      return Promise.reject(err);
    }
    else return challan;

  })
  .then((challan: IChallanModel) => {
    console.log(challan);
    res.sendStatus(200);
  })
  .catch((err) => {
    if ( err.name === "E_NOT_EXISTS" )
      res.sendStatus(404);
    else
      res.sendStatus(500);
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

  // The _id field of CitizenSchema corresponds to the 
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
  // DONE: Atomicity Issue here, we need to fix this by removing the challan schema and adding a
  // Challan field in the Citizen Schema. MongoDB doesn't support transactions (or if 
  // it does, then they need database replicas to be working)
  //
  // There's no way to rollback (unless you explicity delete which isn't Atomic either) 
  // once your newChallan.save() has suceeded.

  .then((citizen: ICitizenModel | null ): PromiseLike<IChallanModel> => {
    if (citizen) {
      let newChallan = new ChallanModel();
      newChallan.license = req.body.license;
      newChallan.email = citizen.personal.email;
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
  //assert(typeof req.body.personal.license !== "undefined");
  assert(typeof req.body.registeredVehicleNos !== "undefined");
  assert(typeof req.body.licenseDetails.LType !== "undefined");

  let citizenExistPromise: Promise<ICitizenModel | null> = 
  CitizenModel.findOne({"personal.email": req.body.personal.email}).exec();
  citizenExistPromise
  .then((citizen: ICitizenModel | null ): any | Promise<ICitizenModel>  => {
    console.log(citizen);
    if (citizen) {
      let err = new Error();
      err.message = `Citizen ${citizen} already exists!`;
      err.name = "E_EXISTS";
      console.error(err);
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
      newCitizen.registeredVehicleNos = req.body.registeredVehicleNos;
      newCitizen.licenseDetails.LType = req.body.licenseDetails.LType;
      newCitizen.licenseDetails.expirationDate = req.body.licenseDetails.expirationDate;
      newCitizen.licenseDetails.creationDate = req.body.licenseDetails.creationDate;
      newCitizen.licenseDetails.learnersLicense = req.body.licenseDetails.learnersLicense;
      return newCitizen.save();
    }
    else return Promise.reject(new Error("Citizen Already Exists In DB!")); 
  })
  .then((newCitizen: ICitizenModel) => {
    console.log(newCitizen);
    res.sendStatus(200);
  })
  .catch((err) => {
    console.error(err);
    if ( err.name === "E_EXISTS" )
      res.sendStatus(409);
    else
      res.sendStatus(500);
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

function verifyLicenseHandler(req: Request, res: Response, next: NextFunction): void {
  assert(typeof req.body.license !== "undefined");
  if (!mongoose.Types.ObjectId.isValid(req.body.license)) {
    res.sendStatus(400);
    return;
  }
  let licensePromise: Promise<ICitizenModel | null> = 
  CitizenModel.findOne({ _id: req.body.license }).exec();

  licensePromise
  .then((citizen: ICitizenModel | null ) => {
    if (citizen) { //citizen exits
      console.log("Citizen exits in DB");
      res.sendStatus(200);
      res.end();
    }
    else { //citizen doesn't exist
    console.log("Citizen doesn't exit in DB");
    res.sendStatus(404);
    res.end();
    };
  })
}

function createTrafficPoliceHandler(req: Request, res: Response, next: NextFunction): void {
  // Assertions to check whether it isn't a Bad Request
  assert(typeof req.body.name !== "undefined");
  assert(typeof req.body.email !== "undefined");
  assert(typeof req.body.designation !== "undefined");
  assert(typeof req.body.location !== "undefined");
  let policeExistPromise: Promise<IPoliceModel | null> = 
  PoliceModel.findOne({"email": req.body.email}).exec();
  policeExistPromise
  .then((police: IPoliceModel | null ): any | Promise<IPoliceModel>  => {
    console.log(police);
    if (police) {
      let err = new Error();
      err.message = `Police ${police} already exists!`;
      err.name = "E_EXISTS";
      console.error(err);
      return Promise.reject(err);
    }
    else return police;
  })
  .then( (police: IPoliceModel | null ): PromiseLike<IPoliceModel> => {
    if(!police) {
      let newPolice = new PoliceModel();
      newPolice.name = req.body.name;
      newPolice.email = req.body.email;
      newPolice.designation = req.body.designation;
      newPolice.location = req.body.location;
      //newPolice.personal.license = req.body.personal.license;
      return newPolice.save();
    }
    else return Promise.reject(new Error("Police Already Exists In DB!")); 
  })
  .then((newPolice: IPoliceModel) => {
    console.log(newPolice);
    res.sendStatus(200);
  })
  .catch((err) => {
    console.error(err);
    if ( err.name === "E_EXISTS" )
      res.sendStatus(409);
    else
      res.sendStatus(500);
  })
}

function getUserInfoByUserHandler(req: Request, res: Response, next: NextFunction): void {
  console.log(req.user);
  let citizenExistPromise: Promise<ICitizenModel | null> = 
  CitizenModel.findOne({"personal.email": req.user.email}).exec();
  citizenExistPromise
  .then((citizen: ICitizenModel | null) => {
    console.log(citizen);
    res.send(citizen);
  })
  .catch((err) => {
    res.sendStatus(404);
    console.error(err);
  })
}

//Given a license number, get corresponding information
function getUserInfoHandler(req: Request, res: Response, next: NextFunction): void {
  assert(typeof req.body.license !== "undefined");
  //console.log(req.user);
  if (!mongoose.Types.ObjectId.isValid(req.body.license)) {
    res.sendStatus(400);
    return;
  }
  let licensePromise: Promise<ICitizenModel | null> = 
  CitizenModel.findOne({ _id: req.body.license }).exec();
  licensePromise
  .then((citizen: ICitizenModel | null ): ICitizenModel | Promise<ICitizenModel> => {
    console.log(citizen);
    if (!citizen) {
      let err = new Error();
      err.message = `Citizen ${citizen} doesn't exists in DB!`;
      err.name = "E_NOT_EXISTS";
      return Promise.reject(err);
    }
    else {
      return citizen;
    };
  })
  .then((citizen: ICitizenModel) => {
      console.log(citizen);
      res.send(citizen);
    //else return Promise.reject(new Error("Citizen Not Found in DB!"));
  })
  .catch((err) => {
    if ( err.name === "E_NOT_EXISTS" )
      res.sendStatus(404);
    else
      res.sendStatus(500);
    console.error(err);
  })

}

//Given police id and new location, update to new location
function updatePoliceLocationHandler(req: Request, res: Response, next: NextFunction): void {
  assert(typeof req.body.policeId !== "undefined");
  assert(typeof req.body.location !== "undefined");
  if (!mongoose.Types.ObjectId.isValid(req.body.policeId)) {
    res.sendStatus(400);
    return;
  }
  //console.log("BAHAR");
  let policeExistPromise: Promise<IPoliceModel | null> = 
  PoliceModel.findOneAndUpdate({_id: req.body.policeId}, {location : req.body.location}).exec();
  policeExistPromise
  .then((police: IPoliceModel | null ): any | Promise<IPoliceModel>  => {
    if (!police) {
      let err = new Error();
      err.message = `Police ${police} doesn't exists in DB!`;
      err.name = "E_NOT_EXISTS";
      return Promise.reject(err);
    }
    else {
      return police;
    };
  })
  .then( (police: IPoliceModel) => {
    console.log(police);
    res.sendStatus(200);
    
  })
  .catch((err) => {
    console.error(err);
    if ( err.name === "E_EXISTS" )
      res.sendStatus(409);
    else
      res.sendStatus(500);
  })
}

//GIVEN POLICE ID, GET DETAILS OF POLICE
function getPoliceDetailsHandler(req: Request, res: Response, next: NextFunction): void {
  assert(typeof req.body.policeId !== "undefined");
  if (!mongoose.Types.ObjectId.isValid(req.body.policeId)) {
    res.sendStatus(400);
    return;
  }
  let policeIdPromise: Promise<IPoliceModel | null> = 
  PoliceModel.findOne({ _id: req.body.policeId }).exec();
  policeIdPromise
  .then((police: IPoliceModel | null ): IPoliceModel | Promise<IPoliceModel> => {
    console.log(police);
    if (!police) {
      let err = new Error();
      err.message = `Police ${police} doesn't exists in DB!`;
      err.name = "E_NOT_EXISTS";
      return Promise.reject(err);
    }
    else {
      return police;
    };
  })
  .then((police: IPoliceModel) => {
    console.log(police);
    res.send(police);
    //else return Promise.reject(new Error("Citizen Not Found in DB!"));
  })
  .catch((err) => {
    if ( err.name === "E_NOT_EXISTS" )
      res.sendStatus(404);
    else
      res.sendStatus(500);
    console.error(err);
  })

}

function getVehicleInfoByUserHandler(req: Request, res: Response, next: NextFunction) {
  console.log(req.user);

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

function getVehicleInfoHandler(req: Request, res: Response, next: NextFunction) {
  assert(typeof req.body.VINNo !== "undefined");
  // TODO: Handle Insurance too
  // TODO: CHeck whether such a license exists or not?
  let registerPromise: Promise<IVehicleModel | null> = VehicleModel.findOne({ VINNo: req.body.VINNo }).exec();
  registerPromise 
    .then((vehicle: IVehicleModel | null): IVehicleModel | Promise<IVehicleModel> => {
      if (!vehicle) {
        res.status(409);
        let err = new Error();
        err.message = `Vehicle ${vehicle} doesn't exists in DB!`;
        err.name = "E_NOT_EXISTS";
        return Promise.reject(err);
      }

      else return vehicle;
    })
    .then((vehicle: IVehicleModel) => {
      console.log(vehicle);
      res.send(vehicle);
    })
    .catch((err: Error) => {
      if ( err.name === "E_NOT_EXISTS" )
        res.sendStatus(404);
      else
        res.sendStatus(500);
      console.error(err);
    })
}

function reportAccidentHandler(req: Request, res: Response, next: NextFunction): void {
  assert(typeof req.body.coordinates !== "undefined");
  // if (!mongoose.Types.ObjectId.isValid(req.body.reporterLicense)) {
  //   res.sendStatus(400);
  //   return;
  // }

  let newAccident = new AccidentModel();
  newAccident.reporterEmail = req.user.email;
  newAccident.date = req.body.date;
  newAccident.coordinates = req.body.coordinates;
  newAccident.description = req.body.description;
  newAccident.save()
  .then((accident: IAccidentModel | null ): any  => {
    console.log(accident);
    res.sendStatus(200);
  })
  .catch((err) => {
    console.error(err);
    res.sendStatus(500);
  })
}

function getAccidentsHandler(req: Request, res: Response, next: NextFunction): void {
  assert(typeof req.body.startDate !== "undefined");
  assert(typeof req.body.endDate !== "undefined");
  let AccidentPromise: Promise<IAccidentModel[]> = AccidentModel.find({date: {$gte: req.body.startDate, $lte:req.body.endDate}}).sort({ date: 1 }).exec();
  AccidentPromise
  .then((allAccidents) => {
    res.send(allAccidents);
  })
  .catch((err) => {
    res.sendStatus(500);
    console.error(err);
  })

}

function getTrafficLightsHandler(req: Request, res: Response, next: NextFunction) {
  TrafficModel.find({}).exec()
    .then((results: ITrafficModel[]) => {
      res.status(200).send(results);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    })
}

//CHALLAN ROUTES

app.post('/createChallan',  //WORKS
  accController.checkLogin,
  accController.checkRTO,
  createChallanHandler 
)

app.get('/challanByUser', 
  accController.checkLogin,
  getChallanByUserHandler
)

app.get('/challanById', 
  accController.checkLogin,
  accController.checkRTO,
  getChallanByIdHandler
)

app.get('/allChallan', 
  accController.checkLogin,
  accController.checkRTO,
  getAllChallanHandler
)

app.post('/payChallan',
  accController.checkLogin,
  payChallanHandler
)

//CITIZEN ROUTES
app.post('/createCitizenLicense', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  createCitizenHandler
)

app.get('/verifyLicenseNumber', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  verifyLicenseHandler
);

app.get('/getUserInfoByUser', //TO DO TEST
  accController.checkLogin,
  getUserInfoByUserHandler
);

app.get('/getUserInfo', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  getUserInfoHandler
);

//POLICE ROUTES
app.post('/createTrafficPolice', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  createTrafficPoliceHandler
)

app.get('/getPoliceDetails', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  getPoliceDetailsHandler
)

app.post('/updatePoliceLocation', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  updatePoliceLocationHandler
)

//VEHICLE ROUTES
app.post('/registerVehicle', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  registerVehicleHandler
)

app.get('/getVehicleInfoByUser', //TO DO AND TO DO CHECK
  accController.checkLogin,
  getVehicleInfoByUserHandler
);

app.get('/getVehicleInfo', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  getVehicleInfoHandler
);

//ACCIDENT ROUTES
app.post('/reportAccident', //WORKS
  accController.checkLogin,
  reportAccidentHandler
)

app.get('/getAccidents', //WORKS
  accController.checkLogin,
  accController.checkRTO,
  getAccidentsHandler
)

// app.get('/getUserReportedAccidents',
//   accController.checkLogin,
//   accController.checkRTO,
//   getUserReportedAccidentsHandler
// )

//TRAFFIC LIGHTS HANDLER
app.post('/updateTrafficLights',
        updateTrafficLightsHandler);


app.get('/getTrafficLights',
        getTrafficLightsHandler);

//AUTHENTICATION ROUTES
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

app.post('/signin', passport.authenticate('local-signin'), 
  (req: Request, res: Response, next: NextFunction) => {
    assert (typeof (req as any).locals !== "undefined");
    res.cookie('authLevel', (req as any).locals.authLevel);
    console.log(res.cookie);
    res.sendStatus(200)
})

app.get('/signout', accController.checkLogin, accController.SignOut);

function updateTrafficLightsHandler(req: Request, res: Response, next: NextFunction) { 
  assert(typeof req.body.trafficLights !== "undefined");
  assert(Array.isArray(req.body.trafficLights));

  let allPromises: Promise<ITrafficModel | null>[] = req.body.trafficLights.map((e: any) => {
    let newLight: ITrafficModel  = new TrafficModel();
    newLight.icon = e.icon;
    newLight.coords = e.coords;
    newLight.name = e.name;
    newLight.address = e.address;
    return newLight.save();
  })

  Promise.all(allPromises)
    .then((ans) => {
      console.log(ans); 
      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error(err);
    })
}

// TODO: CheckLogin and Add AUTH Level RTO
app.use('/*', (err, req: Request, res: Response, next: NextFunction) => {
  // Assertions errors are wrong user inputs
  console.error(err);
  if(err.code === 'ERR_ASSERTION') {
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
