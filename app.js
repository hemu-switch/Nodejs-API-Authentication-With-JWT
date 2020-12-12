const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Import Routes
const authRoute = require('./routes/Auth');

const postRoute = require('./routes/posts');

dotenv.config();

// Connect To Db

mongoose.connect(
  process.env.DB_CONNECT,
  { useNewUrlParser: true, useUnifiedTopology: true },

  () => {
    console.log('Connected to Db');
  }
);

// Middleware
app.use(express.json());

//Route Middleware
app.use('/api/user', authRoute);
app.use('/api/user/posts', postRoute);

app.listen(3000, () => {
  console.log('Connected');
});
