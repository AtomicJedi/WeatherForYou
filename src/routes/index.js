const { Router } = require('express');
const routes = Router()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');

const user = require('../db/models/users')

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const urlencodedParser = bodyParser.urlencoded({extended: true});

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

routes.post('/registration', async (req, res) => {
  let {email, password, confirm} = req.body;

  let errors = [];
  if (!email || !password || !confirm) {
    errors.push({ message: "Please enter all fields" });
  }
  if (password.length < 6) {
    errors.push({ message: "Too shord password,must be min 6 chars" });
  }
  if (password != confirm) {
    errors.push({ message: "Passwords do not match" });
  }
  if (errors.length > 0) {
    res.render("registration", { errors });
  } else {
    let hashedPass = await bcrypt.hash(password, 10);
  }
  user.create({email, password}).then(console.log).catch(console.log)

  console.log({email, password});  
  console.log(errors);  

  // res.status(200).redirect('registration')
})

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
