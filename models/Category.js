// models/Category.js
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parentCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }
});

export default mongoose.models.Category || mongoose.model("Category", categorySchema);
