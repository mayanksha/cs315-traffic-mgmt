import mongoose = require('mongoose')
import bcrypt = require('bcrypt')
const Schema = mongoose.Schema

export enum AUTH_LEVELS {
  ADMIN = 0,
  USER_RTO = 1 << 0,
  USER_POLICE = 1 << 1,
  USER_CITIZEN = 1 << 2,
}

export let UserSchema = new Schema({
  userId: String,
  email: String,
  password: String,
  dateOfRegister: {
    type: Date,
    default: Date.now,
  },
  lastAccessDate: Date,
  authLevel: Number,
})

UserSchema.methods.comparePassword = function(password: string): boolean {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.methods.genHashSync = function(str: string): any {
  return bcrypt.hashSync(str, bcrypt.genSaltSync(8))
}
