import { Document, Schema } from 'mongoose';
import { IInsurance } from '../interfaces/insurance';

export interface IInsuranceModel extends IInsurance, Document {
    
  }