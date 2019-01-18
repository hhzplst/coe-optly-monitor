import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ExperimentHistorySchema = new Schema({
  time: Date,
  number: Number,
}, { timestamps: true });

export default mongoose.model('ExperimentHistory', ExperimentHistorySchema);
