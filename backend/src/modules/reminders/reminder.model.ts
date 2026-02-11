import mongoose, { Document, Schema } from 'mongoose';

export interface IReminder extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  applicationId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  reminderDate: Date;
  type: 'interview' | 'deadline' | 'follow-up' | 'custom';
  isCompleted: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reminderSchema = new Schema<IReminder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Reminder title is required'],
      trim: true,
      maxlength: [200, 'Title too long'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description too long'],
    },
    reminderDate: {
      type: Date,
      required: [true, 'Reminder date is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['interview', 'deadline', 'follow-up', 'custom'],
      default: 'custom',
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc: any, ret: any) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId.toString();
        if (ret.applicationId) {
          ret.applicationId = ret.applicationId.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for efficient queries
reminderSchema.index({ userId: 1, reminderDate: 1 });
reminderSchema.index({ userId: 1, isCompleted: 1 });
reminderSchema.index({ userId: 1, applicationId: 1 });

export const Reminder = mongoose.model<IReminder>('Reminder', reminderSchema);
