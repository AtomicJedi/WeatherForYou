const { Router } = require('express');
const routes = Router()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const { jwtSecret, weatherKey } = require('../config/configOther')
const user = require('../db/models/users')
const favorites = require('../db/models/favoriteCities')

routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(bodyParser.json());

const urlencodedParser = bodyParser.urlencoded({ extended: true });

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
			errors.push({ message: "Validation error or user exist" })
			res.render("registration", { errors });
		}
	}
}
);

routes.get('/registration', async (req, res) => {
	res.render('registration', {
		title: 'Registration'
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

routes.post('/weatherPage', async (req, res) => {
	let { Search, FavoriteCity } = req.body

	try {

		if (Search) {

			await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${Search}&appid=c1afe0e25457bce885930e01a0eb7d27`, {
				method: 'post',
				body: JSON.stringify(Search),
				headers: { 'Content-Type': 'application/json' },
			})
				.then(res => res.json())
				.then(json => {
					if (res.status(200)) {
						let weather = json
						res.render('weatherPage', {
							weather,
							CityName: json.name,
							temp: Math.round(json.main.temp - 273),
							feels_like: Math.round(json.main.feels_like - 273),
							icon: json.weather[0].icon,

						})
					}
				});
		}
		if (FavoriteCity) {
			let city = FavoriteCity
			let cityFavoritesBox = []
			console.log(cityFavoritesBox)
			await favorites.create({ city })
			cityFavoritesBox.push({ MyFavoriteCity: FavoriteCity })
			res.render('weatherPage', { cityFavoritesBox })
		}


	} catch (error) {
		let errorResponse = []
		errorResponse.push({ message: "Something wrong... Try one more time!" })
		res.render('weatherPage', { errorResponse })
		console.log(error);
	}
})

routes.get('/favorites', async (req, res) => {
	let favoriteCityList = [];
	let cityList = await favorites.findAll()
	for (let city of cityList) {
		// console.log(city.city);
		try {
			if (city.city) {
				const res = await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city.city}&appid=c1afe0e25457bce885930e01a0eb7d27`, {
					method: 'post',
					body: JSON.stringify(city),
					headers: { 'Content-Type': 'application/json' },
				});
				const data = await res.json();
				if (data) {
					let favoriteCity = {
						CityName: data.name,
						temp: Math.round(data.main.temp - 273),
						feels_like: Math.round(data.main.feels_like - 273),
						pressure: data.main.pressure,
						windSpeed: data.wind.speed,
						icon: data.weather[0].icon,
					};
					favoriteCityList.push(favoriteCity)
				}
			}
		} catch (error) {
			console.log(error);
			let FavoritGetERROR = []
			FavoritGetERROR.push({ message: 'Not Found city' })
			res.render('favorites', { FavoritPostERROR })
			return;
		}
	}
	res.render('favorites', {
		favoriteCityList
	})
});

routes.post('/favorites', async (req, res) => {
	let { Search, CityName } = req.body
	if (CityName) {
		let dataForRender = [];
		try {
			const resFtute = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${CityName}&appid=c1afe0e25457bce885930e01a0eb7d27`,
				{
					method: 'post',
					body: JSON.stringify(Search),
					headers: { 'Content-Type': 'application/json' },
				}
			)
			const dataFuture = await resFtute.json();
			for (const cityData of dataFuture.list) {
				if (dataFuture) {
					let futureDescription = {
						CityName: dataFuture.city.name,
						time: cityData.dt_txt,
						icon: cityData.weather[0].icon,
						temp: Math.round(cityData.main.temp - 273),
						feels_like: Math.round(cityData.main.feels_like - 273),
						windSpeed: cityData.wind.speed,
						pressure: cityData.main.pressure,
					}
					dataForRender.push(futureDescription)
				}
			}

			console.log(dataForRender);
		} catch (error) {
			let futureERROR = [];
			futureERROR.push(error)
			console.log(error);
		}

		res.render('weatherFuture', {
			title: 'weatherFuture',
			dataForRender
		})

	}
	try {

		if (Search) {

			await fetch(`http://api.openweathermap.org/data/2.5/weather?q=${Search}&appid=c1afe0e25457bce885930e01a0eb7d27`, {
				method: 'post',
				body: JSON.stringify(Search),
				headers: { 'Content-Type': 'application/json' },
			})
				.then(res => res.json())
				.then(json => {
					if (res.status(200)) {
						let weather = json
						res.render('weatherPage', {
							weather,
							CityName: json.name,
							temp: Math.round(json.main.temp - 273),
							feels_like: Math.round(json.main.feels_like - 273),
							icon: json.weather[0].icon,

						})
					}
				});
		}


	} catch (error) {
		let errorResponse = []
		errorResponse.push({ message: "Something wrong... Try one more time!" })
		res.render('favorites', { errorResponse })
		console.log(error);
	}
})

routes.use(function (req, res) {
	res.status(404).send('Not found');
});


module.exports = routes;