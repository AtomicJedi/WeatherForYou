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
res.render('index')
});


routes.use(function(req, res) {
  res.status(404).send('Not found');
});

module.exports = routes;
