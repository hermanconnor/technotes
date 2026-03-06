import { type InferSchemaType, model, Schema } from 'mongoose';
import argon2 from 'argon2';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    roles: {
      type: [String],
      enum: ['Employee', 'Manager', 'Admin'],
      default: ['Employee'],
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// --- Middleware: Hash password before saving ---
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await argon2.hash(this.password);
});

type UserType = InferSchemaType<typeof userSchema>;

export const User = model<UserType>('User', userSchema);
