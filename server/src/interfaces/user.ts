/**
 * Interface for User
 *
 * @interface IUser
 */
import { AuthLevels } from '../controllers/accounts'

export interface IUser {
  citizenId: string
  email: string
  password: string
  dateOfRegister: Date
  lastAccessDate: Date
  authLevel: AuthLevels
  comparePassword: (password: string) => boolean
  genHashSync: (str: string) => any
}
