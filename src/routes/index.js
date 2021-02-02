const { Router } = require('express');
const routes = Router()
const exphbs = require('express-handlebars')

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})
// routes.get('/', (req, res) => {
//   res.status(200).json({ message: 'Ok' });
// });



routes.get('/', (req, res) => {
  res.render('index', {
    title: 'Log in'
  })
});

routes.get('/registration', (req, res) => {
  res.render('registration', {
    title: 'Registration'
  })
});

routes.get('/weatherPage', (req, res) => {
  res.render('weatherPage', {
    title: 'weatherPage'
  })
});

routes.get('/favorites', (req, res) => {
  res.render('favorites', {
    title: 'favorites'
  })
});

routes.use(function (req, res) {
  res.status(404).send('Not found');
});

module.exports = routes;
