import mongoose from "mongoose";
const Schema = mongoose.Schema;

const CampaignSchema = new Schema({
    id: Number,
    project_id: Number,
    name: String,
    page_ids: [Number],
    status: String,
    created: String,
    last_modified: String
}, {timestamps: true});

export default mongoose.model("Campaign", CampaignSchema);