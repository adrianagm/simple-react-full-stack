const express = require('express');
const path = require('path');
const topLogos = require('../client/topLogos');

const app = express();

app.use('/', express.static('dist'));

app.get('/api/getLogos', topLogos.get);
app.get('/api/getLogo/:id', topLogos.getLogoById);

app.listen(8080, () => console.log('Listening on port 8080!'));
