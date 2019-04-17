import { Schema } from 'mongoose'

export let ChallanSchema = new Schema({
  license: { type: String },
  vehicleNo: { type: String },
  date: { type: Date, default: Date.now() },
  policeOfficer: { type: String },
  offence: { type: String },
  fineAmount: { type: Number },
  dueDate: { type: Date },
  coordinates: {
    latitute: { type: Number },
    longitude: { type: Number },
  },
  paymentStatus: {type: Boolean},
  receiptDetails: {
    paymentDate: {type: Date},
    paymentAmount: {type: Number},
    receiptID: {type: String}
  }
})
