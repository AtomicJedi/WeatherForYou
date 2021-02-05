const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
import jwt from 'jsonwebtoken';
const session = require('express-session')
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

app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.use(routes)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use('/', routes);

const port = process.env.PORT || config.server.port;

app.listen(port);

console.log('Node + Express REST API server ALIVE on port: ' + port);

module.exports = app;
