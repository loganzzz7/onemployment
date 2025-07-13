import mongoose from 'mongoose'
const { Schema, model, Types } = mongoose

// a single comment on a commit
const CommentSchema = new Schema({
  author: { type: Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
})

// a single commit inside a repo
const CommitSchema = new Schema({
  summary: { type: String, required: true },
  description: { type: String, default: '' },
  projectSeason: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  comments: { type: [CommentSchema], default: [] }
})

// repo
const RepoSchema = new Schema({
  name: { type: String, required: true },
  summary: String,
  season: String,
  readme: String,
  user: { type: Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: true },
  isStarred: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  stars: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },

  commits: { type: [CommitSchema], default: [] }
})

export default model('Repo', RepoSchema)