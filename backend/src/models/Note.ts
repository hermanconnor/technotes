import { type InferSchemaType, model, Schema } from 'mongoose';
import { Counter } from './Counter.js';

const noteSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    ticket: {
      type: Number,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes
noteSchema.index(
  { title: 1 },
  { unique: true, collation: { locale: 'en', strength: 2 } },
);

noteSchema.index({ title: 'text', text: 'text' });

// --- MANUAL AUTO-INCREMENT LOGIC ---
noteSchema.pre('save', async function () {
  // Check if it's a new document
  if (!this.isNew) return;

  try {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'ticketNums' },
      { $inc: { seq: 1 } },
      { returnDocument: 'after', upsert: true },
    );

    // If counter is null (shouldn't happen with upsert), handle it
    if (counter) {
      this.ticket = counter.seq;
    }
  } catch (error: any) {
    throw error;
  }
});

type NoteType = InferSchemaType<typeof noteSchema>;

export const Note = model<NoteType>('Note', noteSchema);
