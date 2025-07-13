import express from 'express'
import mongoose from 'mongoose'
import Repo from '../models/repo.js'
import User from '../models/user.js'
import { authMiddle } from '../middle/status.js'
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

// GET /api/repos —> list user repos
router.get('/', authMiddle, async (req, res) => {
  try {
    console.log('fetching repos for userId:', req.userId);
    const repos = await Repo.find({ user: req.userId }).sort('-createdAt').populate('user', 'username');
    console.log('found repos:', repos);
    res.json(repos);
  } catch (err) {
    console.error('Failed to load repos:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/repos/:id -> fetch a single repo by its id under user
router.get('/:id', authMiddle, async (req, res) => {
  try {
    const repo = await Repo.findOne({
      _id: req.params.id,
      user: req.userId
    })
      .populate('user', 'username avatarUrl')
      .populate('commits.comments.author', 'username avatarUrl')
    if (!repo) return res.status(404).json({ error: 'Not found' })
    res.json(repo)
  } catch (err) {
    console.error('Failed to load single repo:', err)
    res.status(500).json({ error: err.message })
  }
});

// PATCH /api/repos/:id — update repo (toggle pins/stars + any allowed fields)
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

    const allowed = ['name', 'summary', 'readme', 'isPublic', 'isPinned', 'isStarred']
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        repo[key] = req.body[key]
      }
    }

    await repo.save()

    const populated = await repo.populate('user', 'username avatarUrl')
    res.json(populated)
  } catch (err) {
    console.error('Failed to patch repo:', err)
    res.status(500).json({ error: err.message })
  }
});

// POST /api/repos/:id/commits — add a new commit to a repo
router.post('/:id/commits', authMiddle, async (req, res) => {
  try {
    const { summary, description } = req.body
    const repo = await Repo.findOne({ _id: req.params.id, user: req.userId })
    if (!repo) {
      return res.status(404).json({ error: 'Repo not found or not yours' })
    }

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
});

// PATCH /api/repos/:id/commits/:commitId
router.patch('/:id/commits/:commitId', authMiddle, async (req, res) => {
  try {
    const { id, commitId } = req.params;
    const { description } = req.body;
    const repo = await Repo.findOne({ _id: id, user: req.userId });
    if (!repo) return res.status(404).json({ error: 'Repo not found or not yours' });

    const commit = repo.commits.id(commitId);
    if (!commit) return res.status(404).json({ error: 'Commit not found' });

    commit.description = description;
    await repo.save();
    res.json(commit);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/repos/:id/commits/:commitId/comments — add a new comment to a commit
router.post(
  '/:id/commits/:commitId/comments',
  authMiddle,
  async (req, res) => {
    try {
      const { id, commitId } = req.params
      const { text } = req.body
      if (!text || !text.trim()) {
        return res.status(400).json({ error: 'Comment text is required.' })
      }

      const repo = await Repo.findOne({ _id: id, user: req.userId })
      if (!repo) {
        return res.status(404).json({ error: 'Repo not found or not yours.' })
      }

      const commit = repo.commits.id(commitId)
      if (!commit) {
        return res.status(404).json({ error: 'Commit not found.' })
      }

      const commentId = new Types.ObjectId()
      // push with author = the actual user‐id
      commit.comments.push({
        _id: commentId,
        author: req.userId,
        text: text.trim(),
        createdAt: new Date(),
      })

      await repo.save()

      // re‐populate that newly‐added comment’s author
      await repo.populate('commits.comments.author', 'username avatarUrl')
      const newComment = repo.commits.id(commentId)
      res.status(201).json(newComment)
    } catch (err) {
      console.error('Failed to add comment:', err)
      res.status(500).json({ error: err.message })
    }
  }
);

export default router