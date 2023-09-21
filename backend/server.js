// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const mysql = require('mysql2');
const nodemail = require("nodemailer");
const PORT = process.env.PORT || 3001;

const app = express();
app.use(express.json());

// Author: Stephen Souther
const mailer = nodemail.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: process.env.EMAIL_SECURE,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

// Author: Stephen Souther
mailer.verify(function(error, success) {
	if(error){
		console.log("Failed to connect to mail host");
	}
	else{
		console.log("Mail host connected");
	}
});

// Author: Lakelon Bailey
// Database configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Author: Lakelon Bailey
// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Author: Lakelon Bailey
app.use(express.static(path.resolve(__dirname, '../client/build')));

// Author: Lakelon Bailey
app.get("/api", (req, res) => {
    res.json({ message: "TEST API ENDPOINT SUCCESS" });
});

// Author: Stephen Souther
app.post("/api/email", (req, res) => {
	const email = req.body;
	
	if(!email){
		return res.status(400).json({ error: "Email is required." });
	}
	else{
		
		const mail = {
			from: process.env.EMAIL_USER,
			to: email.email,
			subject: "Hello Plus Email Demo",
			text: "This is a hello world demo for the FragranceFinder website."
		};
		
		mailer.sendMail(mail, function(error, info) {
			if(error){
				console.log("An error has occurred while sending the email.\n" + error);
			}
			else{
				console.log("Email sent: " + info.response);
			}
		});
		
		return res.status(200).json({ message: email });
	}
})

// Author: Lakelon Bailey
// Sample endpoint to fetch data from your database
app.get("/api/data", (req, res) => {
    const sql = "SELECT * FROM posts";
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Author: Lakelon Bailey
app.post("/api/posts/", (req, res) => {

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
})

// Author: Lakelon Bailey
app.get("/api/posts/", (req, res) => {
  const sql = "SELECT * FROM posts";
  db.query(sql, (err, results) => {
      if (err) throw err;
      res.json(results);
  });
})

// Author: Lakelon Bailey
// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// Author: Lakelon Bailey
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
