const express = require('express');
const router = express.Router();

// Define your routes
router.get('/', (req, res) => {
  res.send('Get all rules');
});

// You can add more routes as needed
router.post('/', (req, res) => {
  res.send('Create a new rule');
});

// Export the router
module.exports = router;
