const express = require('express')
const routes = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var fetchuser = require('../middleware/fetchuser')

const JWT_SECRET = 'shirishsucksmydick'

// Route 1: Create a User using:  POST "/api/auth/createuser". No Login required
routes.post('/createuser', [
  body('name', 'Enter a valid UserName').isLength({ min: 3 }),
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Enter Correct Password').isLength({ min: 3 })
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    let user = await User.findOne({ email: req.body.email })
    if (user) {
      return res.status(400).json({ success, error: "Sorry Email already exists..." })
    }

    const salt = await bcrypt.genSalt(10) // creates/generated SALT of size 10
    const secPass = await bcrypt.hash(req.body.password, salt)// creates the hash of password + salt

    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email
    })
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({ success, authtoken })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({
        success: false,
        message: error.message
    });
  }
  // .then(user => res.json(User))
  // .catch(err => {
  //   console.log(err)
  //   res.json({ error: 'Please Enter a Unique Email...' })
  // })
})

// Route 2: Authenticaiton of a User using:  POST "/api/auth/login". No Login required
routes.post('/login', [
  body('email', 'Enter a valid Email').isEmail(),
  body('password', 'Password cannot be blank').exists()
], async (req, res) => {
  let success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: "Please Enter Correct Credentials" })
    }
    const passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare) {
      return res.status(400).json({ success,  error: "Please Enter Correct Credentials" })
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({ success,authtoken })
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Error Occured...")
  }
})

// Route 3: Get loggedin User Details using :  POST "/api/auth/getuser". Login required
routes.post('/getuser',fetchuser, async (req, res) => {
  try {
    const userID = req.user.id;
    console.log(userID)
    const user = await User.findById(userID).select("-password")
    res.send({user})
  } catch (error) {
    console.log(error.message)
    res.status(500).send("Internal Error Occured...")
  }
})
module.exports = routes