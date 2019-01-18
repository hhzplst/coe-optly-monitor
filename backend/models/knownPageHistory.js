import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const KnownPageHistorySchema = new Schema({
  time: Date,
  number: Number,
}, { timestamps: true });

export default mongoose.model('KnownPageHistory', KnownPageHistorySchema);
