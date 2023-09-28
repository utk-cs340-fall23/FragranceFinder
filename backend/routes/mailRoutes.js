const router = require('express').Router();
const mailer = require('../config/mail');

router.post("/api/email", (req, res) => {
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

module.exports = router;