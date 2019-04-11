import { Document, Schema } from 'mongoose';
import { ICitizen } from '../interfaces/citizen';

export interface ICitizenModel extends ICitizen, Document {
    
  }