import { Schema, model, Types, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  description: string;
  category: string;
  tags: string[];
  images: string[];
  createdBy: Types.ObjectId;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  blocks: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

 const ArticleSchema = new Schema<IArticle>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: [String], default: [] },
  images: { type: [String], default: [] },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  likes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  dislikes: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
  blocks: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
}, {
  timestamps: true,
});
export const ArticleModel = model<IArticle>("Article", ArticleSchema);
