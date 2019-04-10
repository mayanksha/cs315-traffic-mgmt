import { Document, Schema } from 'mongoose';
import { IUser } from '../interfaces/user';

/**
 * Interface for IUserModel 
 *
 * @interface IUserModel 
 */
export interface IUserModel extends IUser, Document {
  comparePassword: (password: string) => boolean;
  genHashSync: (str: string) => any
}
