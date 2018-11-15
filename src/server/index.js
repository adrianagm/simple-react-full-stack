const express = require('express');
const path = require('path');
const topLogos = require('./topLogos');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', express.static('dist'));

app.get('/api/getLogos', topLogos.get);
app.get('/api/getLogo/:id', topLogos.getLogoById);
app.post('/api/updateLogo', topLogos.update);

app.listen(8080, () => console.log('Listening on port 8080!'));
