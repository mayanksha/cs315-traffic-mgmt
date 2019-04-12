import { Schema } from 'mongoose'

export let VehicleSchema = new Schema({
  vehicle_no: { type: String },
  vehicle_type: { type: String },
  vehicle_color: { type: String },
  insurance: { type: Boolean },
  registered: { type: String },
})
