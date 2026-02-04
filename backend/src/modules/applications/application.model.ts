import mongoose, { Document, Schema } from 'mongoose';
import {
  ApplicationStage,
  ApplicationStatus,
  JobType,
  TimelineEventType,
} from '@common/types';

export interface IContact {
  name: string;
  role: string;
  email?: string;
  linkedin?: string;
}

export interface ITimelineEvent {
  stage: ApplicationStage;
  title: string;
  description?: string;
  date: Date;
  type: TimelineEventType;
}

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  companyLogo?: string;
  role: string;
  location: string;
  jobType: JobType;
  salary?: string;
  stage: ApplicationStage;
  status: ApplicationStatus;
  appliedDate: Date;
  deadline?: Date;
  nextInterviewDate?: Date;
  source: string;
  jobUrl?: string;
  notes: string;
  timeline: ITimelineEvent[];
  contacts: IContact[];
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String },
    linkedin: { type: String },
  },
  { _id: false }
);

const timelineEventSchema = new Schema<ITimelineEvent>(
  {
    stage: {
      type: String,
      enum: ['applied', 'oa', 'tech', 'hr', 'offer', 'rejected'],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true, default: Date.now },
    type: {
      type: String,
      enum: ['stage_change', 'interview', 'note', 'reminder'],
      required: true,
    },
  },
  { _id: false }
);

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name too long'],
    },
    companyLogo: {
      type: String,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
      maxlength: [100, 'Role name too long'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    jobType: {
      type: String,
      enum: ['full-time', 'internship', 'contract'],
      required: [true, 'Job type is required'],
    },
    salary: {
      type: String,
      trim: true,
    },
    stage: {
      type: String,
      enum: ['applied', 'oa', 'tech', 'hr', 'offer', 'rejected'],
      default: 'applied',
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'archived'],
      default: 'active',
      required: true,
    },
    appliedDate: {
      type: Date,
      required: [true, 'Applied date is required'],
      default: Date.now,
    },
    deadline: {
      type: Date,
    },
    nextInterviewDate: {
      type: Date,
    },
    source: {
      type: String,
      required: [true, 'Source is required'],
      trim: true,
    },
    jobUrl: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      default: '',
      maxlength: [5000, 'Notes too long'],
    },
    timeline: {
      type: [timelineEventSchema],
      default: [],
    },
    contacts: {
      type: [contactSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for better query performance
applicationSchema.index({ userId: 1, createdAt: -1 });
applicationSchema.index({ userId: 1, stage: 1 });
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, companyName: 1 });

// Add initial timeline event on creation
applicationSchema.pre('save', function (next) {
  if (this.isNew && this.timeline.length === 0) {
    this.timeline.push({
      stage: this.stage,
      title: 'Application Created',
      date: this.appliedDate || new Date(),
      type: 'stage_change',
    });
  }
  next();
});

export const Application = mongoose.model<IApplication>('Application', applicationSchema);
