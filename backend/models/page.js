import mongoose from "mongoose";
const Schema = mongoose.Schema;

const PageSchema = new Schema({
    id: Number,
    project_id: Number,
    name: String,
    archived: Boolean,
    created: String,
    last_modified: String
}, {timestamps: true});

export default mongoose.model("Page", PageSchema);