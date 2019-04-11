import { Document, Schema } from 'mongoose';
import { IChallan } from '../interfaces/challan';

export interface IChallanModel extends IChallan, Document {
    
  }