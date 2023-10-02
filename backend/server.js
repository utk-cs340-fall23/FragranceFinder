// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const nodemail = require("nodemailer");
const PORT = process.env.PORT || 3001;
const app = express();
const sequelize = require("./config/connection");

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

app.use(express.json());

// Author: Stephen Souther
mailer.verify(function(error, success) {
	if(error){
		console.log("Failed to connect to mail host");
	}
	else{
		console.log("Mail host connected");
	}
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

// Direct all routes starting with api to the API's routes
app.use('/api', require('./routes'));

// All other GET requests not handled before will return to our React app for frontend routing
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

sequelize.sync({ force: false }).then(() => {
	app.listen(PORT, () => console.log('Now listening'));
});
