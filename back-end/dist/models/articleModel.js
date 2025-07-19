"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArticleModel = void 0;
const mongoose_1 = require("mongoose");
const ArticleSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    images: { type: [String], default: [] },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: [mongoose_1.Schema.Types.ObjectId], ref: "User", default: [] },
    dislikes: { type: [mongoose_1.Schema.Types.ObjectId], ref: "User", default: [] },
    blocks: { type: [mongoose_1.Schema.Types.ObjectId], ref: "User", default: [] },
}, {
    timestamps: true,
});
exports.ArticleModel = (0, mongoose_1.model)("Article", ArticleSchema);
