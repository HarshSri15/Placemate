import { Router } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserRepository } from '@modules/users/user.repository';
import { validate } from '@middleware/validate';
import { authenticate } from '@middleware/auth';
import { signupSchema, loginSchema, refreshTokenSchema } from './auth.schema';

const router = Router();

// Initialize dependencies
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

/**
 * @route   POST /auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', validate(signupSchema), authController.signup);

/**
 * @route   POST /auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @route   POST /auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', authController.refreshToken);

/**
 * @route   POST /auth/logout
 * @desc    Logout user (current device)
 * @access  Private
 */
router.post('/logout', authenticate, authController.logout);

/**
 * @route   POST /auth/logout-all
 * @desc    Logout user from all devices
 * @access  Private
 */
router.post('/logout-all', authenticate, authController.logoutAll);

/**
 * @route   GET /auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
