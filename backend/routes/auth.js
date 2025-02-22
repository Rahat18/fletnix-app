// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const User = require('../models/user');

// // @route    POST /api/auth/register
// // @desc     Register a new user
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password, dob } = req.body;

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     // Create new user instance
//     user = new User({ email, password, dob });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Save user in database
//     await user.save();

//     res.status(201).json({ msg: 'User registered successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // @route    POST /api/auth/login
// // @desc     Authenticate user and return success message
// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Check password match
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ msg: 'Invalid credentials' });
//     }

//     // Authentication successful
//     res.json({ msg: 'Login successful' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = 'your_jwt_secret_key'; // Use a strong secret key

// @route    POST /api/auth/register
// @desc     Register a new user
// router.post('/register', async (req, res) => {
//   try {
//     const { email, password, dob } = req.body;

//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) {
//       return res.status(400).json({ msg: 'User already exists' });
//     }

//     // Create new user instance
//     user = new User({ email, password, dob });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);

//     // Save user in database
//     await user.save();

//     res.status(201).json({ msg: 'User registered successfully' });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });
router.post('/register', async (req, res) => {
  try {
    const { email, password, dob } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user instance
    user = new User({ email, password, dob });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user in database
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    res.status(201).json({ token, user: { id: user._id, email: user.email, dob: user.dob } });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route    POST /api/auth/login
// @desc     Authenticate user and return token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email }, // Payload
      JWT_SECRET,
      { expiresIn: '1h' } // Token expiration time
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route    GET /api/auth/user
// @desc     Get logged-in user details
// @access   Private
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

router.get('/user', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
