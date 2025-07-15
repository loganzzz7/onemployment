import express from 'express'
import User from '../models/user.js'
import { authMiddle } from '../middle/status.js'

const router = express.Router()

// POST /api/users/:username/follow -> follow that user
router.post('/:username/follow', authMiddle, async (req, res) => {
  try {
    const me = await User.findById(req.userId)
    const them = await User.findOne({ username: req.params.username })
    if (!them) return res.status(404).json({ error: 'User not found' })

    // only follow once
    if (!me.following.includes(them._id)) {
      me.following.push(them._id)
      them.followers.push(me._id)
      await me.save()
      await them.save()
    }

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/users/:username/follow -> unfollow that user
router.delete('/:username/follow', authMiddle, async (req, res) => {
  try {
    const me = await User.findById(req.userId)
    const them = await User.findOne({ username: req.params.username })
    if (!them) return res.status(404).json({ error: 'User not found' })

    me.following = me.following.filter(id => !id.equals(them._id))
    them.followers = them.followers.filter(id => !id.equals(me._id))
    await me.save()
    await them.save()

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

export default router