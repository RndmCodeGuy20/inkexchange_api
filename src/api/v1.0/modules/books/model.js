import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  name: String,
  description: String,
  author: String,
  seller_id: String,
  genre: String,
  pages: Number,
  current_price: Number,
  original_price: Number,
  previous_price: Number,
  condition: String,
  status: String,
  images: Array,
  created_at: Date,
  updated_at: Date,
});

const Book = mongoose.model('Book', bookSchema);

export { Book };
