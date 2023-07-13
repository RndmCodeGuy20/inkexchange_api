import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  username: String,
  status: Boolean,
});

const Test = mongoose.model('Test', testSchema);

export { Test };
