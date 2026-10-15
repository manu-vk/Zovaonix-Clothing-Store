
const express = require('express');
const protect = require("../middleware/authMiddleware");
const { getUsers,getProfile, addUser,loginUser, logoutUser,googleLogin, } = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/', getUsers);

// register
userRouter.post('/register', addUser);

// login
userRouter.post('/login',loginUser );
userRouter.get('/profile', protect, getProfile); 

userRouter.post("/google", googleLogin);


userRouter.post("/logout", logoutUser);

module.exports = userRouter;