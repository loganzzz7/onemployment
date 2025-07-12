import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = express.Router()

// POST /api/auth/register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body
    try {
        const user = new User({ username, email })
        await user.setPassword(password)
        await user.save()
        // sign JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
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
        return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
    res.json({ token, user: { id: user._id, username: user.username, email } })
})

export default router