const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
  age: { type: Number, required: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  experience: { type: Number, required: true },
});

module.exports = mongoose.model('UserData', userDataSchema);
