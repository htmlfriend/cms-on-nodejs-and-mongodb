const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const UrlSlugs = require("mongoose-url-slugs");

const PostSchema = new Schema({
  category: {
    type: Schema.Types.ObjectId,
    ref: "categories",
  },
  title: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
  },
  allowComments: {
    type: Boolean,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  file: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  slug: {
    type: String,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
});

// modifies Schema

PostSchema.plugin(
  UrlSlugs("title", {
    field: "slug",
  })
);

module.exports = mongoose.model("posts", PostSchema);
