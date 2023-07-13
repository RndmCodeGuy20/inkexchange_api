import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  description: String,
  author: String,
  seller_id: String,
  genre: String,
  images: Array,
  current_price: Number,
  original_price: Number,
  previous_price: Number,
  condition: String,
  status: String,
  created_at: Date,
  updated_at: Date,
});

const Book = mongoose.model('Book', bookSchema);

export { Book };
