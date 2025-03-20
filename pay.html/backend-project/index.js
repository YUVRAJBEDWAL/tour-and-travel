const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

// MongoDB connection URI
const uri = 'mongodb://152.56.5.204:27017'; // Update with your MongoDB URI

// Connect to MongoDB
    MongoClient.connect(uri)

  .then(client => {
    console.log('Connected to Database');
    const db = client.db('test'); // Replace with your database name

    // Sample endpoint
    app.get('/api/data', (req, res) => {
      res.json({ message: 'Welcome to the MongoDB API!' });
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(error => console.error(error));
