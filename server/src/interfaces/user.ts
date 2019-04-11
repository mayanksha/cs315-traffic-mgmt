/**
 * Interface for User
 *
 * @interface IUser
 */
export interface IUser {
  userId: string
  email: string
  password: string
  dateOfRegister: Date
  lastAccessDate: Date
  comparePassword: (password: string) => boolean
  genHashSync: (str: string) => any
}
