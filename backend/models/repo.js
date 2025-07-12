import mongoose from 'mongoose'
const { Schema, model, Types } = mongoose

const RepoSchema = new Schema({
  name:       { type: String, required: true },
  summary:    String,
  season:     String,
  readme:     String,
  user:       { type: Types.ObjectId, ref: 'User', required: true },
  isPublic:   { type: Boolean, default: true },
  isStarred:  { type: Boolean, default: false },
  isPinned:   { type: Boolean, default: false },
  stars:      { type: Number, default: 0 },
  createdAt:  { type: Date, default: Date.now },
  commits:    { type: Array, default: [] }
})

export default model('Repo', RepoSchema)