import { Schema } from 'mongoose'

export let citizenSchema = new Schema({
  name: { type: String },
  personal: {
    address: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    license: { type: String },
  },
  offences: {
    Paid: { type: Array },
    Unpaid: { type: Array },
  },
  registered_vehicle_no: { type: String },
})
//functions for make payment, get receipt and report offence.
