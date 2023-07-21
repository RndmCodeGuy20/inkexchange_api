import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  author: {
    type: String,
    required: true,
  },
  seller_id: {
    type: String,
    required: true,
  },
  genre: String,
  pages: Number,
  current_price: Number,
  original_price: Number,
  previous_price: Number,
  condition: String,
  status: {
    type: String,
    enum: ['available', 'sold', 'deleted', 'rented'],
    default: 'available',
  },
  images: Array,
  created_at: Date,
  updated_at: Date,
});

const Book = mongoose.model('Book', bookSchema);

export { Book };
