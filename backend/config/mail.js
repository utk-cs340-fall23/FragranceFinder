const nodemail = require("nodemailer");

const mailer = nodemail.createTransport({
	host: process.env.EMAIL_HOST,
	port: process.env.EMAIL_PORT,
	secure: process.env.EMAIL_SECURE,
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS
	}
});

mailer.verify(function(error, success) {
	if(error){
		console.log("Failed to connect to mail host");
	}
	else{
		console.log("Mail host connected");
	}
});

module.exports = mailer;