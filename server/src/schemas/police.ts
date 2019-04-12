import { Schema } from 'mongoose'

export let PoliceSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  designation: { type: String },
  location: { type: String },
})
//functions to look into citizen details from license number and to make challan.
