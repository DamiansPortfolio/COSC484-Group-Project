// middleware/authMiddleware.js
import jwt from "jsonwebtoken"

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  })
}

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]

  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" })
  }
}

export { generateToken, verifyToken }
