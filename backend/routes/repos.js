import express from 'express'
import mongoose from 'mongoose'
import Repo from '../models/repo.js'
import User from '../models/user.js'
import { authMiddle } from '../middle/status.js'
import jwt from 'jsonwebtoken'
const { Types } = mongoose

const router = express.Router()

// POST /api/repos -> create new repo
router.post('/', authMiddle, async (req, res) => {
  try {
    const { name, summary, season, readme } = req.body
    const repo = await Repo.create({
      name,
      summary,
      season,
      readme,
      user: req.userId,
    })
    res.status(201).json(repo)
  } catch (err) {
    console.error('Create repo failed:', err)
    res.status(400).json({ error: err.message })
  }
})

// GET /api/repos -> list current user’s repos
router.get('/', authMiddle, async (req, res) => {
  try {
    const repos = await Repo
      .find({ user: req.userId })
      .sort('-createdAt')
      .populate('user', 'username')
    res.json(repos)
  } catch (err) {
    console.error('Failed to load repos:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/repos/user/:username -> fetch a user’s profile
router.get('/user/:username', async (req, res) => {
  try {
    const u = await User.findOne({ username: req.params.username })
      .select('username name bio company location website socials avatarUrl followers following createdAt')
    if (!u) return res.status(404).json({ error: 'User not found' })
    res.json({ user: u })
  } catch (err) {
    console.error('Failed to load user profile:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/repos/all -> list public repos, optionally filter by ?user=username
router.get('/all', async (req, res) => {
  try {
    const filter = { isPublic: true }

    // if ?user=somebody, only that user’s public repos
    if (req.query.user) {
      const u = await User.findOne({ username: req.query.user }).select('_id')
      if (!u) return res.status(404).json({ error: 'User not found' })
      filter.user = u._id
    }

    const repos = await Repo
      .find(filter)
      .sort('-createdAt')
      .populate('user', 'username avatarUrl')

    res.json(repos)
  } catch (err) {
    console.error('Failed to load public repos:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/repos/:id -> fetch one repo (public for everyone, private only to owner)
router.get('/:id', async (req, res) => {
  try {
    // try to extract userId from Bearer token if present
    let userId = null
    const auth = req.headers.authorization
    if (auth?.startsWith('Bearer ')) {
      try {
        const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET)
        userId = payload.id
      } catch { /* ignore invalid token */ }
    }

    const repo = await Repo.findById(req.params.id)
      .populate('user', 'username avatarUrl')
      .populate('commits.comments.author', 'username avatarUrl')

    if (!repo) return res.status(404).json({ error: 'Not found' })
    if (!repo.isPublic && repo.user._id.toString() !== userId) {
      return res.status(404).json({ error: 'Not found' })
    }
    res.json(repo)
  } catch (err) {
    console.error('Failed to load single repo:', err)
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/repos/:id -> update (only owner)
router.patch('/:id', authMiddle, async (req, res) => {
  try {
    const repo = await Repo.findOne({ _id: req.params.id, user: req.userId })
    if (!repo) return res.status(404).json({ error: 'Not found or not yours' })

    if (req.body.togglePin) {
      repo.isPinned = !repo.isPinned
    }
    if (req.body.toggleStar) {
      const willStar = !repo.isStarred
      repo.isStarred = willStar
      repo.stars = Math.max(0, repo.stars + (willStar ? 1 : -1))
    }

    const allowed = ['name','summary','readme','isPublic','isPinned','isStarred']
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        repo[key] = req.body[key]
      }
    }

    await repo.save()
    const populated = await repo.populate('user','username avatarUrl')
    res.json(populated)
  } catch (err) {
    console.error('Failed to patch repo:', err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/repos/:id/commits -> add commit (only owner)
router.post('/:id/commits', authMiddle, async (req, res) => {
  try {
    const { summary, description } = req.body
    const repo = await Repo.findOne({ _id: req.params.id, user: req.userId })
    if (!repo) return res.status(404).json({ error: 'Repo not found or not yours' })

    const commit = {
      _id: new Types.ObjectId(),
      summary,
      description,
      projectSeason: repo.season,
      createdAt: new Date(),
    }
    repo.commits.push(commit)
    await repo.save()
    res.status(201).json(commit)
  } catch (err) {
    console.error('Failed to add commit:', err)
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/repos/:id/commits/:commitId -> update commit (only owner)
router.patch('/:id/commits/:commitId', authMiddle, async (req, res) => {
  try {
    const { id, commitId } = req.params
    const { description } = req.body
    const repo = await Repo.findOne({ _id: id, user: req.userId })
    if (!repo) return res.status(404).json({ error: 'Repo not found or not yours' })

    const commit = repo.commits.id(commitId)
    if (!commit) return res.status(404).json({ error: 'Commit not found' })

    commit.description = description
    await repo.save()
    res.json(commit)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// POST /api/repos/:id/commits/:commitId/comments -> add comment (only owner)
router.post('/:id/commits/:commitId/comments', authMiddle, async (req, res) => {
  try {
    const { id, commitId } = req.params
    const { text } = req.body
    if (!text?.trim()) {
      return res.status(400).json({ error: 'Comment text is required.' })
    }

    const repo = await Repo.findOne({ _id: id, user: req.userId })
    if (!repo) return res.status(404).json({ error: 'Repo not found or not yours.' })

    const commit = repo.commits.id(commitId)
    if (!commit) return res.status(404).json({ error: 'Commit not found.' })

    const commentId = new Types.ObjectId()
    commit.comments.push({
      _id: commentId,
      author: req.userId,
      text: text.trim(),
      createdAt: new Date(),
    })

    await repo.save()
    await repo.populate('commits.comments.author','username avatarUrl')
    const newComment = repo.commits.id(commentId)
    res.status(201).json(newComment)
  } catch (err) {
    console.error('Failed to add comment:', err)
    res.status(500).json({ error: err.message })
  }
})

export default router