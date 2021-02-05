const { Router } = require('express');
const routes = Router()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');

const user = require('../db/models/users')

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const urlencodedParser = bodyParser.urlencoded({ extended: true });

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

routes.post('/', async (req, res) => {
	let { email, password } = req.body;

	console.log({ email, password });

	try {
		await user.findOne({ where: { email: email, password: password } })
			.then(user => {
				let errorsLogin = []
				if (!user) {
					errorsLogin.push( { message: "Login or password is wrong" } )
							res.render('index', { errorsLogin });}
				
				
				if (user.email === email, user.password === password) {
					res.render('weatherPage', {
						title: 'weatherPage'
					})
				}
				console.log(user.email, user.password);
			}).catch(err => console.log(err));

	} catch (error) {
		let errors = [];
		errors.push(error)
		res.redirect('/', { errors });
	}



}
)


// user.findOne({ where: { name: "Tom" } })
// 	.then(user => {
// 		if (!user) return;
// 		console.log(user.name, user.age);
// 	}).catch(err => console.log(err));




routes.get('/registration', async (req, res) => {
	res.render('registration', {
		title: 'Registration'
	})
});

routes.post('/registration', async (req, res) => {
	let { email, name, password, confirm } = req.body;

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
		try {
			let hashedPass = await bcrypt.hash(password, 10);
			await user.create({ name, email, password: hashedPass })
			res.redirect('/')
		} catch (error) {
			// console.log(error);
			errors.push(error)
			res.render("registration", { errors });
		}
	}
}
);

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
