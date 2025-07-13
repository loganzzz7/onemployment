import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { authMiddle } from '../middle/status.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        const user = new User({ username, email })
        await user.setPassword(password)
        await user.save()
        // sign JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' })
        res.json({ token, user: { id: user._id, username, email } })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.validatePassword(password))) {
        return res.status(401).json({ error: 'Bad credentials' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '14d' })
    res.json({ token, user: { id: user._id, username: user.username, email } })
})

// GET /api/auth/me
router.get('/me', authMiddle, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash')
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user })
})

// PATCH /api/auth/me
router.patch('/me', authMiddle, async (req, res) => {
  try {
    const u = await User.findById(req.userId)
    if (!u) return res.status(404).json({ error: 'Not found' })

    const { name, bio, company, location, website, twitter, linkedin, github } = req.body

    if (name    !== undefined) u.name     = name
    if (bio     !== undefined) u.bio      = bio
    if (company !== undefined) u.company  = company
    if (location!== undefined) u.location = location
    if (website !== undefined) u.website  = website

    u.socials = u.socials || {}
    if (twitter  !== undefined) u.socials.twitter  = twitter
    if (linkedin !== undefined) u.socials.linkedin = linkedin
    if (github   !== undefined) u.socials.github   = github

    await u.save()

    res.json({ user: u })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})


export default router