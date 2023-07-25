import { Router } from 'express';
import userController from '../controllers/userController.js';
import requireAuth from '../helpers/requireAuth.js';

const router = Router();

// Log in user
router.post('/login', userController.loginUser);

// Sign up user
router.post('/new', userController.signupUser);

// Get list of all users
router.get('/', requireAuth, userController.getUsers);

// Get user with matching email
router.get('/email', requireAuth, userController.getUserByEmail);

// Get user with matching username
router.get('/username', requireAuth, userController.getUserByUsername);

// Get session data if exists
router.get('/session', userController.getSession);

// Refresh session with updated avatar and cover photo data
router.get('/session/refresh', userController.refreshSession);

// Close session
router.get('/logout', userController.endSession)

// Login with google
router.post('/login/google', userController.loginWithGoogle)

// Get user with matching id
router.get('/:id', requireAuth, userController.getUserById);

// Set user avatar photo
router.post("/:id/avatar", requireAuth, userController.setAvatar)

// Set user cover photo
router.post("/:id/cover_photo", requireAuth, userController.setCoverPhoto)

export default router