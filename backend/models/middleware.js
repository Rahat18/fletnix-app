const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = 'your_jwt_secret_key';

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ msg: 'No token provided' });

    const token = authHeader.split(' ')[1] || authHeader;
    if (!token) return res.status(401).json({ msg: 'Invalid token format' });

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Ensure token contains correct user data
    if (!decoded.id) return res.status(401).json({ msg: 'Invalid token payload' });

    // Fetch user
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
