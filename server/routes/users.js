import { Router } from 'express';
import userController from '../controllers/userController.js';

const router = Router();

// Log in user
router.post('/login', userController.loginUser);

// Sign up user
router.post('/new', userController.signupUser);

// Get list of all users
router.get('/', userController.getUsers);

// Get user with matching email
router.get('/email', userController.getUserByEmail);

// Get user with matching username
router.get('/username', userController.getUserByUsername);

// Get session data if exists
router.get('/session', userController.getSession)

// Close session
router.get('/logout', userController.endSession)

// Login with google
router.post('/login/google', userController.loginWithGoogle)

export default router