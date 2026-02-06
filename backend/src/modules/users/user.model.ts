import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUserPreferences {
  emailReminders: boolean;
  reminderDaysBefore: number;
  theme: 'light' | 'dark' | 'system';
  defaultView: 'dashboard' | 'pipeline';
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  college?: string;
  graduationYear?: number;
  preferences: IUserPreferences;
  refreshTokens: string[];
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userPreferencesSchema = new Schema<IUserPreferences>(
  {
    emailReminders: { type: Boolean, default: true },
    reminderDaysBefore: { type: Number, default: 1, min: 0, max: 30 },
    theme: { 
      type: String, 
      enum: ['light', 'dark', 'system'], 
      default: 'system' 
    },
    defaultView: { 
      type: String, 
      enum: ['dashboard', 'pipeline'], 
      default: 'dashboard' 
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    avatar: {
      type: String,
      default: null,
    },
    college: {
      type: String,
      trim: true,
      maxlength: [100, 'College name cannot exceed 100 characters'],
    },
    graduationYear: {
      type: Number,
      min: [1900, 'Invalid graduation year'],
      max: [2100, 'Invalid graduation year'],
    },
    preferences: {
      type: userPreferencesSchema,
      default: () => ({}),
    },
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete (ret as any)._id;
        delete (ret as any).__v;
        delete (ret as any).password;
        delete (ret as any).refreshTokens;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', userSchema);
