/**
 * Interface for User
 *
 * @interface IUser
 */
export interface IUser {
  userId: string,
  email: string, 
  password: string,
  dateOfRegister: Date,
  lastAccessDate: Date
}
