const { Router } = require('express');
const routes = Router()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { jwtSecret, weatherKey } = require('../config/configOther')
const user = require('../db/models/users')



routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const urlencodedParser = bodyParser.urlencoded({ extended: true });

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

const generateTocken = (id, email) => {
	const filling = {
		id,
		email
	}
	return jwt.sign(filling, jwtSecret, { expiresIn: 60 * 60 })
}

routes.get('/', (req, res) => {
	res.render('index', {
		title: 'Log in'
	})
});

// Authorization

routes.post('/', async (req, res) => {
	let { email, password } = req.body;

	const usr = await user.findOne({ where: { email: email } });

	let errorsLogin = []

	if (!usr) {
		errorsLogin.push({ message: "User not exist" })
	}
	if (!usr || !bcrypt.compareSync(password, usr.password)) {
		errorsLogin.push({ message: "Login or password is wrong" })
	}
	console.log(errorsLogin);
	if (errorsLogin.length > 0) {
		res.render('index', { errorsLogin });
	} else {
		try {
			const token = generateTocken(usr.id, usr.email)
			res.header('Token', token)
			req.session.auth = token
			res.redirect('/weatherPage')
			return res.json({ token })

		} catch (error) {
			// console.log(error);
			let errorsLogin = []
			errorsLogin.push({ message: "Server ERROR" })
			res.status(500).render('index', { errorsLogin });
		}
	}

});

routes.get('/weatherPage', (req, res) => {
	try {
		let token = req.session.auth;
		if (!token) token = req.headers;
		if (!token) throw new Error("Unauthorized");

		if (jwt.verify(token, jwtSecret)) {
			res.header('Authorization', token)
			res.render('weatherPage', {
				title: 'weatherPage'
			})
		}
	} catch (error) {
		let errorsClient = []
		errorsClient.push({ message: "Time session is out. Pleace, relogin." })
		res.status(408).render('index', { errorsClient });
	}
});

routes.get('/registration', async (req, res) => {
	res.render('registration', {
		title: 'Registration'
	})
});

routes.post('/weatherPage', async (req, res) => {
	let {Search} = req.body
	try{
		await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${Search}&appid=c1afe0e25457bce885930e01a0eb7d27`, {
			method: 'post',
			body:    JSON.stringify(Search),
			headers: { 'Content-Type': 'application/json' },
		})
		.then(res => res.json())
		.then(json => {
			res.render('weatherPage', {
				CityName: json.name,
				temp: json.main.temp,
				feels_like: json.main.feels_like,
				pressure: json.main.pressure,
				humidity: json.main.humidity,
				icon: json.weather,
				wind: json.wind.speed

			})
			console.log(json.name)
		} );
	} catch(error){
		let errorResponse = []
		errorResponse.push({ message: "Something wrong... Try one more time!" })
		res.render('weatherPage', { errorResponse })
		console.log(error);
	}

	// console.log({Search})
})

// Registration
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

routes.get('/favorites', (req, res) => {
	res.render('favorites', {
		title: 'favorites'
	})
});

// routes.get('/test', (req, res) => {
// 	try {
// 		const { authorization } = req.headers;
// 		jwt.verify(authorization, jwtSecret);
// 		res.send('ok')
// 	} catch (error) {
// 		res.send('not ok')
// 	}
// })

routes.use(function (req, res) {
	res.status(404).send('Not found');
});


module.exports = routes;
