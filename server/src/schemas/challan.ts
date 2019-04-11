import { Schema } from 'mongoose'

export let challanSchema = new Schema({
  license: { type: String },
  vehicle_no: { type: String },
  date: { type: Date },
  police_officer: { type: String },
  offence: { type: String },
  fine: { type: String },
  due: { type: Date },
})
