import mongoose = require('mongoose')
import bcrypt = require('bcrypt')

import { AuthLevels } from '../controllers/accounts'
const Schema = mongoose.Schema

export let UserSchema = new Schema({
  citizenId: String,
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
