import { Schema } from 'mongoose'

export let PoliceSchema = new Schema({
  name: { type: String },
  email: {type: String},
  designation: { type: String },
  location: {
    latitude: Number,
    longitude: Number
  },
})
//functions to look into citizen details from license number and to make challan.
