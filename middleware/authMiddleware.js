const jwt = require("jsonwebtoken")
const asyncHandler = require('express-async-handler')
const Drone = require("../models/Drone")

const protect = asyncHandler(async (req, res, next) => {
    let token
  
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1]
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // Get user from token
        req.user = await Drone.findById(decoded.id).select('-password')
  
        next()
      } catch (error) {
        console.log(error)
        res.status(401).json('Invalid Token!')
        // throw new Error('Not authorized')
      }
    }
  
    if (!token) {
      res.status(401).json('Not authorized!')
    //   throw new Error('Not authorized')
    }
})

module.exports = { protect }