import { Document, Schema } from 'mongoose'
import { IAccident } from '../interfaces/accident'

export interface IAccidentModel extends IAccident, Document {}
