import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    id: Number,
    name: String,
    status: String,
    created: String,
    last_modified: String
}, {timestamps: true});

export default mongoose.model("Project", ProjectSchema);