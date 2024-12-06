// import { Schema, model } from 'mongoose';

// const logSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   action: { type: String, required: true },
//   timestamp: { type: Date, default: Date.now },
// });

// export default model('Log', logSchema);

import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
});

const Log = mongoose.model('Log', logSchema);
export default Log;
