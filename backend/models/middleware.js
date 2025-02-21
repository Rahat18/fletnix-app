const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Mongoose User model
const secretKey = 'your_secret_key'; // Use a secure key, store in env variable

module.exports = async (req, res, next) => {
  try {
    // Expecting "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ msg: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ msg: 'Invalid token format' });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);
    // decoded typically contains { userId: ..., iat: ..., exp: ... }

    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-password'); 
    // ^ select('-password') excludes the password field

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
