const express = require('express');
const path = require('path');

//const cache = require('./services/cache');
const index = require('./src/routes/index');

const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());


/*eslint no-undef: "error"*/
app.use(express.static(path.join(__dirname, 'public'))); // eslint-disable-line no-undef

app.use('/', index);


// Start the server
const PORT = process.env.PORT || 8080; // eslint-disable-line no-undef
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`); // eslint-disable-line no-console
  console.log('Press Ctrl+C to quit.'); // eslint-disable-line no-console
});

module.exports = app;
