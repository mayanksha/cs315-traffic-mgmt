import { Schema } from 'mongoose'

export let InsuranceSchema = new Schema({
  name: { type: String },
  license: { type: String },
  vehicle_no: { type: String },
  vehicle_type: { type: String },
  insured_from: { type: Date },
  expires_at: { type: Date },
  policy_scheme: { type: String },
  policy_no: { type: String },
})
