import { Document, Schema } from 'mongoose';
import { IPolice } from '../interfaces/police';

export interface IPoliceModel extends IPolice, Document {
    
  }