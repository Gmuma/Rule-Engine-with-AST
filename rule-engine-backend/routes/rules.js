const express = require('express');
const router = express.Router();
const Node = require('../models/Node');

router.post('/create_rule', async (req, res) => {
  try {
    const node = new Node(req.body);
    await node.save();
    res.status(201).json(node);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/evaluate_rule', async (req, res) => {
  const { ast, userData } = req.body;
  const result = evaluate(ast, userData);
  res.json({ result });
});

function evaluate(node, data) {
  if (node.type === 'operand') {
    const [key, operator, value] = node.value.split(' ');
    switch (operator) {
      case '>': return data[key] > Number(value);
      case '<': return data[key] < Number(value);
      case '=': return data[key] === value;
      default: return false;
    }
  }
  if (node.value === 'AND') return evaluate(node.left, data) && evaluate(node.right, data);
  if (node.value === 'OR') return evaluate(node.left, data) || evaluate(node.right, data);
}

module.exports = router;
