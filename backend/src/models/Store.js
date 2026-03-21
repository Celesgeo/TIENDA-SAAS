import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema(
  {
    primaryColor: { type: String, default: '#6366f1' },
    accentColor: { type: String, default: '#0ea5e9' },
    backgroundColor: { type: String, default: '#fafafa' },
    fontFamily: {
      type: String,
      default: 'Inter',
      enum: ['Inter', 'DM Sans', 'Playfair Display', 'Space Grotesk'],
    },
    layout: { type: String, enum: ['grid', 'minimal', 'magazine'], default: 'grid' },
    darkMode: { type: Boolean, default: false },
  },
  { _id: false }
);

const storeSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logoUrl: { type: String, default: '' },
    customDomain: { type: String, default: '', trim: true },
    theme: { type: themeSchema, default: () => ({}) },
    published: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

storeSchema.index({ owner: 1 }, { unique: true });

export const Store = mongoose.model('Store', storeSchema);
