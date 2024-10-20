const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db');
const Node = require('./models/Node');
const UserData = require('./models/UserData');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Create a new rule node (API)
app.post('/api/rules/create_node', async (req, res) => {
  try {
    const { type, value, left, right } = req.body;
    const node = new Node({ type, value, left, right });
    await node.save();
    res.status(201).json(node);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create node' });
  }
});

// Fetch all nodes (API)
app.get('/api/rules/nodes', async (req, res) => {
  try {
    const nodes = await Node.find().populate('left').populate('right');
    res.status(200).json(nodes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch nodes' });
  }
});

// Store user data (API)
app.post('/api/users', async (req, res) => {
  try {
    const userData = new UserData(req.body);
    await userData.save();
    res.status(201).json(userData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to store user data' });
  }
});

// Evaluate rule against user data (API)
app.post('/api/rules/evaluate', async (req, res) => {
  try {
    const { ast, userData } = req.body;
    const result = evaluateRule(ast, userData);
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: 'Rule evaluation failed' });
  }
});

// Helper function to evaluate rule
const evaluateRule = (node, userData) => {
  if (node.type === 'operand') {
    const [key, operator, value] = node.value.split(' ');
    switch (operator) {
      case '>':
        return userData[key] > Number(value);
      case '<':
        return userData[key] < Number(value);
      case '=':
        return userData[key] === value;
      default:
        return false;
    }
  } else if (node.type === 'operator') {
    const leftResult = evaluateRule(node.left, userData);
    const rightResult = evaluateRule(node.right, userData);
    return node.value === 'AND' ? leftResult && rightResult : leftResult || rightResult;
  }
};

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
