import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ProjectHistorySchema = new Schema({
  time: Date,
  number: Number,
}, { timestamps: true });

export default mongoose.model('ProjectHistory', ProjectHistorySchema);
