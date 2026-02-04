import { Router } from 'express';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { ApplicationRepository } from '@modules/applications/application.repository';
import { authenticate } from '@middleware/auth';

const router = Router();

// Initialize dependencies
const applicationRepository = new ApplicationRepository();
const analyticsService = new AnalyticsService(applicationRepository);
const analyticsController = new AnalyticsController(analyticsService);

// All analytics routes require authentication
router.use(authenticate);

/**
 * @route   GET /analytics/dashboard
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/dashboard', analyticsController.getDashboardStats);

/**
 * @route   GET /analytics/stage-distribution
 * @desc    Get application stage distribution
 * @access  Private
 */
router.get('/stage-distribution', analyticsController.getStageDistribution);

/**
 * @route   GET /analytics/applications-by-month
 * @desc    Get applications grouped by month
 * @access  Private
 */
router.get('/applications-by-month', analyticsController.getApplicationsByMonth);

/**
 * @route   GET /analytics/top-companies
 * @desc    Get top companies by application count
 * @access  Private
 */
router.get('/top-companies', analyticsController.getTopCompanies);

/**
 * @route   GET /analytics/conversion-rates
 * @desc    Get stage conversion rates
 * @access  Private
 */
router.get('/conversion-rates', analyticsController.getConversionRates);

/**
 * @route   GET /analytics/full
 * @desc    Get complete analytics data
 * @access  Private
 */
router.get('/full', analyticsController.getFullAnalytics);

export default router;
