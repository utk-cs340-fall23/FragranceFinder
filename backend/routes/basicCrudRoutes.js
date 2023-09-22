const router = require('express').Router();
const db = require('../config/connection');

// Author: Lakelon Bailey
// CRUD Example endpoints: Provide ability to Create, Retrieve, Update, and Delete posts.
router.post("/api/posts/", (req, res) => {

  // Get expected values from request body
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
});

router.delete("/api/posts/:postId", (req, res) => {
    const sql = `
        DELETE FROM posts WHERE id = ${req.params.postId};
    `;

    // Execute the query
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        // Send a response back indicating success
        res.json({ message: "Post deleted successfully."});
    });
});

router.put("/api/posts/:postId", (req, res) => {
    const {title, description} = req.body;
    const sql = `
        UPDATE posts
        SET title = '${title}', description = '${description}'
        WHERE id = ${req.params.postId};
    `;

    // Execute the query
    db.query(sql, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: "Database error occurred." });
        }

        // Send a response back indicating success
        res.json({ message: "Post updated successfully."});
    });
})

router.get("/api/posts/", (req, res) => {
  const sql = "SELECT * FROM posts";
  db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
  });
})

module.exports = router;