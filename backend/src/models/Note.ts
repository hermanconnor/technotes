import mongoose, { type InferSchemaType, model, Schema } from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

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
  },
  {
    timestamps: true,
  },
);

// Case-Insensitive Unique Index
// This prevents "Project A" and "project a" from being duplicates.
noteSchema.index(
  { title: 1 },
  {
    unique: true,
    collation: { locale: 'en', strength: 2 },
  },
);

// Auto-Increment Plugin
noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 1,
});

// Note: Manually add 'ticket' because InferSchemaType doesn't see plugin fields
type NoteType = InferSchemaType<typeof noteSchema> & {
  ticket: number;
};

export const Note = model<NoteType>('Note', noteSchema);
