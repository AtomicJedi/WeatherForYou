import express from 'express';
import bodyParser from 'body-parser';
import jwt from'jsonwebtoken';

import config from 'config';
import db from './db/db';
import routes from './routes';

const exphbs = require('express-handlebars')


const app = express();
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('view view')

app.use(routes)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', routes);

const port = process.env.PORT || config.server.port;

app.listen(port);

console.log('Node + Express REST API skeleton server started on port: ' + port);

module.exports = app;
