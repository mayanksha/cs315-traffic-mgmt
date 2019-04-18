import { Schema } from 'mongoose'

export let VehicleSchema = new Schema({
  vehicleNo: { type: String },
  vehicleType: { type: String },
  licenseNo: { type: String },
  // This is Vehicle Identification Number
  VINNo: { type: String, required: true, unique: true },
  vehicleColor: { type: String },
  insurance: {
    insuredFrom: { type: Date },
    expiresAt: { type: Date },
    policyScheme: { type: String },
    policyNo: { type: String }
  },
  registeredTo: { type: String },
  PAN_No: { type: String }
})
