const express = require('express');
const path = require('express');
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

import config from 'config';
import db from './db/db';
const routes = require('./routes');

const exphbs = require('express-handlebars')

// console.log(routes);

const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(routes)

app.use('./css', express.static(__dirname + './node_modules/bootstrap/dist/css'))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/', routes);

const port = process.env.PORT || config.server.port;

app.listen(port);

console.log('Node + Express REST API server ALIVE on port: ' + port);

module.exports = app;
