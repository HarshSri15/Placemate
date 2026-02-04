import { Router } from 'express';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { ReminderRepository } from './reminder.repository';
import { authenticate } from '@middleware/auth';
import { validate } from '@middleware/validate';
import {
  createReminderSchema,
  updateReminderSchema,
  getReminderSchema,
  listRemindersSchema,
} from './reminder.schema';

const router = Router();

// Initialize dependencies
const reminderRepository = new ReminderRepository();
const reminderService = new ReminderService(reminderRepository);
const reminderController = new ReminderController(reminderService);

// All reminder routes require authentication
router.use(authenticate);

/**
 * @route   POST /reminders
 * @desc    Create a new reminder
 * @access  Private
 */
router.post('/', validate(createReminderSchema), reminderController.create);

/**
 * @route   GET /reminders
 * @desc    Get all reminders with filters and pagination
 * @access  Private
 */
router.get('/', validate(listRemindersSchema), reminderController.list);

/**
 * @route   GET /reminders/upcoming
 * @desc    Get upcoming reminders
 * @access  Private
 */
router.get('/upcoming', reminderController.getUpcoming);

/**
 * @route   GET /reminders/overdue
 * @desc    Get overdue reminders
 * @access  Private
 */
router.get('/overdue', reminderController.getOverdue);

/**
 * @route   GET /reminders/:id
 * @desc    Get reminder by ID
 * @access  Private
 */
router.get('/:id', validate(getReminderSchema), reminderController.getById);

/**
 * @route   PUT /reminders/:id
 * @desc    Update reminder
 * @access  Private
 */
router.put('/:id', validate(updateReminderSchema), reminderController.update);

/**
 * @route   DELETE /reminders/:id
 * @desc    Delete reminder
 * @access  Private
 */
router.delete('/:id', validate(getReminderSchema), reminderController.delete);

/**
 * @route   PATCH /reminders/:id/complete
 * @desc    Mark reminder as completed
 * @access  Private
 */
router.patch('/:id/complete', validate(getReminderSchema), reminderController.markAsCompleted);

/**
 * @route   PATCH /reminders/:id/incomplete
 * @desc    Mark reminder as incomplete
 * @access  Private
 */
router.patch(
  '/:id/incomplete',
  validate(getReminderSchema),
  reminderController.markAsIncomplete
);

export default router;
