import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Optional if using OAuth providers
  dob?: Date;
  gender?: string;
  score: number;
  avatar: string;
  isVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  completedChallenges: string[];
  unlockedAreas: string[];
  carbonSaved: number;
  treesSaved: number;
  waterSaved: number;
  plasticReduced: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    password: {
      type: String,
      select: false, // Don't return password by default
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },
    score: {
      type: Number,
      default: 0,
    },
    completedChallenges: {
      type: [String],
      default: [],
    },
    unlockedAreas: {
      type: [String],
      default: ['home'],
    },
    avatar: {
      type: String,
      default: function() {
        // Generate initials from name
        const name = (this as any).name || 'User';
        return name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2);
      }
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    carbonSaved: { type: Number, default: 0 },
    treesSaved: { type: Number, default: 0 },
    waterSaved: { type: Number, default: 0 },
    plasticReduced: { type: Number, default: 0 },
    otp: {
      type: String,
      select: false,
    },
    otpExpiry: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
