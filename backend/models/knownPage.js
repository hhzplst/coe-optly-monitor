import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const KnownPageSchema = new Schema({
  id: Number,
}, { timestamps: true });

export default mongoose.model('KnownPage', KnownPageSchema);
