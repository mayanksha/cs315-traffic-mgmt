import { Schema } from 'mongoose'

export let AccidentSchema = new Schema({
  reporterLicense: { type: String },
  coordinates: {
    latitute: { type: Number },
    longitude: { type: Number },
  }
})
