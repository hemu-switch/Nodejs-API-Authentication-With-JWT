const router = require('express').Router();

const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post('/register', async (req, res) => {
  // Validation of User
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //Checking if User is already in database
  const emailExists = await User.findOne({ email: req.body.email });

  if (emailExists) return res.status(400).send('Email already exists');

  //Hash Password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  //Creating a New User

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword
  });

  try {
    const savedUser = await user.save();
    res.status(201).json({ user: savedUser._id });
  } catch (err) {
    // res.status(400).send(err);
    res.status(400).send('Sorry');
  }
});

router.post('/login', async (req, res) => {
  // Validation of User
  const { error } = loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  //Checking if User is already in database
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Email Not Found!');

  //Check Password is correct
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) return res.status(400).send('Invalid Password');

  // Create and Assign Token

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
