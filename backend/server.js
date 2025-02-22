const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const dbURI = 'mongodb+srv://Rahat:Rahat_7980@cluster0.tn45d.mongodb.net/netflix?authSource=admin'; // Replace with your MongoDB URI and database name
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/api/auth', require('./routes/auth'));

// ... other requires and middlewares
app.use('/api/netflix', require('./routes/collections'));
// ... start server etc.


// For production, serve Angular's static files (if you build your Angular app into a dist folder)
// Uncomment and adjust the following if you are deploying in a combined environment
// app.use(express.static(path.join(__dirname, '../frontend/dist/frontend')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist/frontend/index.html'));
// });

app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
