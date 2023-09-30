// Load environment variables
require('dotenv').config();

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./config/db');
const mailer = require('./config/mail');

function test(){
	console.log("tick");
}

setInterval(test, 3600000);

app.use(express.json());

app.use(require('./routes'));

app.use(express.static(path.resolve(__dirname, '../client/build')));

// All other GET requests not handled before will return to our React app for frontend routing
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
