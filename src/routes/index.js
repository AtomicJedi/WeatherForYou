const { Router } = require('express');
const routes = Router()


routes.get('/', (req, res) => {
  // res.status(200).json({ message: 'Ok' });
  res.render('index')
});

routes.use(function(req, res) {
  response.sendNotFound(res);
});

module.exports = routes;
