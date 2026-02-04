import { Router } from 'express';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import applicationRoutes from './modules/applications/application.routes';
import analyticsRoutes from './modules/analytics/analytics.routes';
import reminderRoutes from './modules/reminders/reminder.routes';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'PlaceMate API is running',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Mount module routes
 */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/applications', applicationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/reminders', reminderRoutes);

export default router;
