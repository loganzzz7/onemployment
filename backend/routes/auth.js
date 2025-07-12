import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { statusMiddle } from '../middle/status.js'

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
router.get('/me', statusMiddle, async (req, res) => {
  const user = await User.findById(req.userId).select('-passwordHash')
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user })
})

export default router