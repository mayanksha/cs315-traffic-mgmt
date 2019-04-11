import { Document, Schema } from 'mongoose';
import { ITraffic } from '../interfaces/traffic';

export interface ITrafficModel extends ITraffic, Document {
    
  }