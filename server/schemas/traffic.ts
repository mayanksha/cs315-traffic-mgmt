import { Schema } from 'mongoose';

export let trafficSchema = new Schema ({
    location : {type: String},
    coords: {type: String}

})