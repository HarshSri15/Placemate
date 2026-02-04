import { Router } from 'express';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validate';
import {
  updateProfileSchema,
  updatePreferencesSchema,
  changePasswordSchema,
} from './user.schema';

const router = Router();

// Initialize dependencies
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

// All user routes require authentication
router.use(authenticate);

/**
 * @route   GET /users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', userController.getProfile);

/**
 * @route   PUT /users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

/**
 * @route   PUT /users/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', validate(updatePreferencesSchema), userController.updatePreferences);

/**
 * @route   POST /users/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', validate(changePasswordSchema), userController.changePassword);

/**
 * @route   DELETE /users/account
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/account', userController.deleteAccount);

/**
 * @route   GET /users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', userController.getStats);

export default router;
