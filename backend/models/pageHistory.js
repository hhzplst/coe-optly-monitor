import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PageHistorySchema = new Schema({
  time: Date,
  number: Number,
}, { timestamps: true });

export default mongoose.model('PageHistory', PageHistorySchema);
