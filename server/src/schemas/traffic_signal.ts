import { Schema } from 'mongoose'
export let TrafficSchema = new Schema({
  icon : { type: String },
  coords: {
    latitude: Number,
    longitude: Number,
  },
  name: { type: String },
  address: { type: String },
})
/*TrafficSchema.index({
 *  coords: {
 *    latitude: 1,
 *    longitude: 1
 *  } 
 *}, { unique: true })*/
