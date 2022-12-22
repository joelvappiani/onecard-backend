const express = require('express');
const router = express.Router();
require('../models/connections');
const User = require('../models/users')
const checkBody = require('../modules/checkBody');
const createUser = require('../modules/createUser');
const bcrypt = require('bcrypt');

//Signup
router.post('/signup', async function (req, res) {
  try {
    //Check if some fields are empty
    if (!checkBody(req.body, ['firstName', 'lastName', 'email', 'password'])) {
      res.json({ result: false, message: 'Missing or empty fields' })
      return;
    }

    const { firstName, lastName, email, password } = req.body
    // Check if the user has not already been registered
    const found = await User.findOne({ email })
    if (!found) {
      const newUser = await createUser(firstName, lastName, email, false, password)
      res.json({
        result: true,
        message: 'New user created',
        token: newUser.token,
        userId: newUser._id,
        socialLogin: newUser.socialLogin
      })
    } else {
      // User already exists in database
      res.json({ result: false, message: 'User already exists' });
    }

  } catch (error) {
    console.log(error)
    res.json({ result: false, message: 'Error' })
  }
})
  ;

//Signin
router.post('/signin', async (req, res) => {
  try {
    if (!checkBody(req.body, ['email', 'password'])) {
      res.json({ result: false, message: 'Missing or empty fields' })
      return;
    }

    const { email, password } = req.body
    const found = await User.findOne({ email })
    console.log(found)
    if (!found) {
      res.json({ result: false, message: 'Wrong email or password' })
    } else if (found.socialLogin) {
      res.json({ result: false, message: 'Social login detected, please connect with it' })
    } else if (bcrypt.compareSync(password, found.password)) {
      res.json({
        result: true,
        token: found.token,
        userId: found._id,
        message: 'User connected',
        socialLogin: found.socialLogin
      });
    } else {
      res.json({ result: false, message: 'Wrong email or password' })
    }
  } catch (error) {
    console.log(error)
    res.json({ result: false, message: 'Error' })
  }
})

//Login with social media
router.post('/socialLogin', async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body
    const found = await User.findOne({ email })
    if (!found) {
      const newUser = await createUser(firstName, lastName, email, true)
      res.json({
        result: true,
        message: 'New user created',
        token: newUser.token,
        userId: newUser._id,
        socialLogin: newUser.socialLogin
      })
    } else {

      res.json({
        result: true,
        message: 'User found in the db',
        token: found.token,
        userId: found._id,
        socialLogin: found.socialLogin
      })
    }
  } catch (error) {
    console.log(error)
    res.json({ result: false, message: 'Error' })
  }
})

//Post profile photo
router.post('/photo', async(req, res)=> {
  try {
      const { userId, photoUrl } = req.body
      const user = await User.findByIdAndUpdate(userId, {photo: photoUrl})
      res.json({result: true, message: 'User photo updated'})
  } catch(error) {
   console.log(error)
   res.json({result: false, message: 'Error'})
  }
})

// //Post profile photo
// router.post('/cover', async(req, res)=> {
//   try {
//       const { userId, coverUrl } = req.body
//       const user = await User.findByIdAndUpdate(userId, {cover: coverUrl})
//       res.json({result: true, message: 'User cover updated'})
//   } catch(error) {
//    console.log(error)
//    res.json({result: false, message: 'Error'})
//   }
// })

// //Post profile photo
// router.post('/photo', async(req, res)=> {
//   try {
//       const { userId } = req.body
//       const user = await Qr.findById(userId)
//       res.json({result: true, message: 'User found', user})
//   } catch(error) {
//    console.log(error)
//    res.json({result: false, message: 'Error'})
//   }
// })


module.exports = router;






