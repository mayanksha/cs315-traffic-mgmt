import { Schema } from 'mongoose'

// Reference: https://en.wikipedia.org/wiki/Driving_licence_in_India
export enum LICENSE_TYPES {
  MC_50CC = 'Motorcycle 50cc',
  MC_EX50CC = 'Motorcycle more than 50cc',
  MCWOG = 'Motorcycle Without Gear',
  MCWG = 'Motorcycle With Gear',
  LMV = 'Light Motor Vehicle',
  LMV_NT = 'Light Motor Vehicle—Non Transport',
  LMV_TR = 'Light Motor Vehicle—Transpor',
  LDRXCV = 'Loader, Excavator, Hydraulic Equipments',
  HMV = 'Heavy Motor Vehicle',
  HPMV = 'Heavy Passenger Motor Vehicle',
  HTV = 'Heavy Goods Motor Vehicle, Heavy Passenger Motor Vehicle',
  TRANS = 'Heavy Goods Motor Vehicle, Heavy Passenger Motor Vehicle',
  TRAILERE = 'A person holding a heavy vehicle driving licence can only apply for heavy trailer licence',
}
export let CitizenSchema = new Schema({
  // The _id field of CitizenSchema correspods to the License Number of
  // that person
  name: { type: String },
  personal: {
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    //license: { type: String },
  },
  // offences: {
  //   Paid: { type: Array },
  //   Unpaid: { type: Array },
  // },
  registeredVehicleNos: { type: Array },
  licenseDetails: {
    creationDate: { type: Date, default: Date.now() },
    LType: { type: LICENSE_TYPES },

    // TODO: Set its default to say 10 years + Date.now()
    expirationDate: { type: Date },
    learnersLicense: { type: Boolean, default: false },
  },
})
//functions for make payment, get receipt and report offence.
