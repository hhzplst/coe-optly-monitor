import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CampaignHistorySchema = new Schema({
  time: Date,
  number: Number,
}, { timestamps: true });

export default mongoose.model('CampaignHistory', CampaignHistorySchema);
