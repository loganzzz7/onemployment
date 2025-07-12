import jwt from 'jsonwebtoken'

export function statusMiddle(req, res, next) {
  const auth = req.headers.authorization?.split(' ')
  if (auth?.[0] !== 'Bearer' || !auth[1]) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const { id } = jwt.verify(auth[1], process.env.JWT_SECRET)
    req.userId = id
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}