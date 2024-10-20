const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['operator', 'operand'], // Example: AND/OR or conditions
  },
  value: {
    type: String,
    required: true, // Example: 'age > 30' or 'AND'
  },
  left: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node', // Reference to left child node
    default: null,
  },
  right: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Node', // Reference to right child node
    default: null,
  },
});

module.exports = mongoose.model('Node', nodeSchema);
