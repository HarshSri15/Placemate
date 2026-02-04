import { Router } from 'express';
import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';
import { ApplicationRepository } from './application.repository';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validate';
import {
  createApplicationSchema,
  updateApplicationSchema,
  getApplicationSchema,
  listApplicationsSchema,
  updateStageSchema,
  addTimelineEventSchema,
} from './application.schema';

const router = Router();

// Initialize dependencies
const applicationRepository = new ApplicationRepository();
const applicationService = new ApplicationService(applicationRepository);
const applicationController = new ApplicationController(applicationService);

// All application routes require authentication
router.use(authenticate);

/**
 * @route   POST /applications
 * @desc    Create a new job application
 * @access  Private
 */
router.post(
  '/',
  validate(createApplicationSchema),
  applicationController.create
);

/**
 * @route   GET /applications
 * @desc    Get all applications with filters and pagination
 * @access  Private
 */
router.get(
  '/',
  validate(listApplicationsSchema),
  applicationController.list
);

/**
 * @route   GET /applications/upcoming-interviews
 * @desc    Get upcoming interviews
 * @access  Private
 */
router.get(
  '/upcoming-interviews',
  applicationController.getUpcomingInterviews
);

/**
 * @route   GET /applications/:id
 * @desc    Get application by ID
 * @access  Private
 */
router.get(
  '/:id',
  validate(getApplicationSchema),
  applicationController.getById
);

/**
 * @route   PUT /applications/:id
 * @desc    Update application
 * @access  Private
 */
router.put(
  '/:id',
  validate(updateApplicationSchema),
  applicationController.update
);

/**
 * @route   DELETE /applications/:id
 * @desc    Delete application
 * @access  Private
 */
router.delete(
  '/:id',
  validate(getApplicationSchema),
  applicationController.delete
);

/**
 * @route   PATCH /applications/:id/stage
 * @desc    Update application stage
 * @access  Private
 */
router.patch(
  '/:id/stage',
  validate(updateStageSchema),
  applicationController.updateStage
);

/**
 * @route   POST /applications/:id/timeline
 * @desc    Add timeline event to application
 * @access  Private
 */
router.post(
  '/:id/timeline',
  validate(addTimelineEventSchema),
  applicationController.addTimelineEvent
);

/**
 * @route   PATCH /applications/:id/archive
 * @desc    Archive application
 * @access  Private
 */
router.patch(
  '/:id/archive',
  validate(getApplicationSchema),
  applicationController.archive
);

/**
 * @route   PATCH /applications/:id/unarchive
 * @desc    Unarchive application
 * @access  Private
 */
router.patch(
  '/:id/unarchive',
  validate(getApplicationSchema),
  applicationController.unarchive
);

export default router;
