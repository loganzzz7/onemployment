import express from 'express'
import Repo from '../models/repo.js'
import { authMiddle } from '../middle/status.js'

const router = express.Router()

// POST /api/repos
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

export default router