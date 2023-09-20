// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// Database configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
    res.json({ message: "TEST API ENDPOINT SUCCESS" });
});

// Sample endpoint to fetch data from your database
app.get("/api/data", (req, res) => {
    const sql = "SELECT * FROM posts";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.post("/api/posts/", (req, res) => {
  const { title, description } = req.body;

    // Check if title and description are provided
    if (!title || !description) {
        return res.status(400).json({ error: "Both title and description are required." });
    }

    // Construct the SQL query
    const sql = "INSERT INTO posts (title, description) VALUES (?, ?)";

    // Execute the query
    db.query(sql, [title, description], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        // Send a response back indicating success
        res.json({ message: "Post created successfully.", postId: result.insertId });
    });
})

app.get("/api/posts/", (req, res) => {
  const sql = "SELECT * FROM posts";
  db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
  });
})

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
