const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const router = require('express-promise-router')();
const {initializeDatabase} = require('./database');
const setupRoutes = require('./routes');


const app = express();

app.use(cors());
app.use(bodyParser.json());

setupRoutes(router);
app.use('/', router);

app.use((error, request, response, next) => {
	console.error(error.stack);

	response
		.status(500)
		.json({
			success: false,
			error: error.message,
		});
});

const port = 4000;
initializeDatabase().then(() => {
	app.listen(port, () => {
		console.log(`Server listening on http://localhost:${port}`);
	});
});
