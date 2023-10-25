// Load environment variables
require('dotenv').config();
const dbUpdate = require('./utils/dbUpdater');

const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const sequelize = require('./config/db');

app.use(express.json());

// Direct all routes starting with api to the API's routes
app.use('/api', require('./routes'));

// All other GET requests not handled before will return to our React app for frontend routing
app.use(express.static(path.resolve(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
});

sequelize.sync({ force: false, alter: true }).then(() => {
	app.listen(PORT, () => console.log('Now listening'));
});