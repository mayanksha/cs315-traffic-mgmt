import { Document, Schema } from 'mongoose'
import { ITraffic } from '../interfaces/traffic_signal'

export interface ITrafficModel extends ITraffic, Document {}
