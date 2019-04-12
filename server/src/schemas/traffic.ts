import { Schema } from 'mongoose'

export let TrafficSchema = new Schema({
  location: { type: String },
  coords: { type: String },
})
