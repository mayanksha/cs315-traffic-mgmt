import { Schema } from 'mongoose'

export let AccidentSchema = new Schema({
  reporterEmail: { type: String },
  coordinates: {
    latitute: { type: Number },
    longitude: { type: Number },
  },
  date: { type: Date, default: Date.now() },
  description: { type: String}
})
