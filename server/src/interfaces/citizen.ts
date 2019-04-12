import { LICENSE_TYPES } from '../schemas/citizen'
export interface ICitizen {
  name: { type: string }
  personal: {
    address: string
    phNum: string
    email: string
    license: string
  }
  offences: {
    Paid: string[]
    Unpaid: string[]
  }
  registeredVehicleNos: string[]
  licenseDetails: {
    creationDate: Date
    LType: LICENSE_TYPES
    expirationDate: Date
    learnersLicense: boolean
  }
}
//functions for make payment, get receipt and report offence.
