import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { authMiddle } from '../middle/status.js'
import multer from "multer";
import path from "path";

const router = express.Router()

const upload = multer({
  dest: path.join(process.cwd(), "pfpuploads/"),
  limits: { fileSize: 5 * 1024 * 1024 } // e.g. 5MB max
});

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

    // email change
    const { email, password, name, bio, company, location, website, twitter, linkedin, github } = req.body

    if (email !== undefined) {
      // require password confirmation
      if (!password) {
        return res.status(400).json({ error: 'Password is required to change email' })
      }
      // validate password
      const ok = await u.validatePassword(password)
      if (!ok) {
        return res.status(401).json({ error: 'Incorrect password' })
      }
      u.email = email
    }

    if (name     !== undefined) u.name     = name
    if (bio      !== undefined) u.bio      = bio
    if (company  !== undefined) u.company  = company
    if (location !== undefined) u.location = location
    if (website  !== undefined) u.website  = website

    u.socials = u.socials || {}
    if (twitter  !== undefined) u.socials.twitter  = twitter
    if (linkedin !== undefined) u.socials.linkedin = linkedin
    if (github   !== undefined) u.socials.github   = github

    await u.save()

    // return the up-to-date user
    res.json({ user: u })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

// PATCH /api/auth/password
router.patch('/password', authMiddle, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // make sure user sent both
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: 'Both current and new passwords are required' })
    }

    // load user
    const user = await User.findById(req.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })

    // verify current password
    const valid = await user.validatePassword(currentPassword)
    if (!valid) {
      return res
        .status(401)
        .json({ error: 'Current password is incorrect' })
    }

    // hash n save new
    await user.setPassword(newPassword)
    await user.save()

    return res.json({ message: 'Password updated successfully' })
  } catch (err) {
    console.error('Password change failed:', err)
    return res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/me/avatar
router.post(
  "/me/avatar",
  authMiddle,
  upload.single("avatar"),
  async (req, res) => {
    try {
      // find the user
      const u = await User.findById(req.userId);
      if (!u) return res.status(404).json({ error: "User not found" });

      // multer has put the file at uploads/<random-filename>
      // construct the public URL
      u.avatarUrl = `/pfpuploads/${req.file.filename}`;
      await u.save();

      // return the up-to-date user object
      res.json({ user: u });
    } catch (err) {
      console.error("Avatar upload failed:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router