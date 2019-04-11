import { Document, Schema } from 'mongoose';
import { IVehicle } from '../interfaces/vehicle';

export interface IVehicleModel extends IVehicle, Document {
    
  }