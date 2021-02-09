const { Router } = require('express');
const routes = Router()
const exphbs = require('express-handlebars')
const bcrypt = require('bcrypt')
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const {jwtSecret} = require('../config/configOther')


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
	return jwt.sign(filling, jwtSecret, {expiresIn: '1h'})
}

routes.get('/', (req, res) => {
	res.render('index', {
		title: 'Log in'
	})
});

routes.post('/', async (req, res) => {
	let { email, password } = req.body;
	let errorsLogin = []

	// Authorization
	try {

		const usr = await user.findOne({ where: { email: email } });

		const token = generateTocken(usr.id, usr.email)
		// let errorsLogin = []
		if (!usr) {
			errorsLogin.push( { message: "Login or password is wrong" } )
			res.status(401).redirect('index', { errorsLogin });
		}
		if(!bcrypt.compareSync(password,usr.password)){
			errorsLogin.push( { message: "Login or password is wrong" } )
			res.status(401).redirect('index', { errorsLogin });
		}

		res.header('Token', token)
		req.session.auth = token
		res.redirect('/weatherPage')
		return res.json({token})

	} catch (error) {
		console.log(error);
		let errorsLogin = []
		errorsLogin.push({message: "Server ERROR"})
		res.status(500).render('index', { errorsLogin });
	}
});

routes.get('/weatherPage', (req, res) => {
	try {
		let token = req.session.auth; 
		if(!token) token = req.headers;
		if(!token) throw new Error("Unauthorized");

		if(jwt.verify(token, jwtSecret)){
			res.header('Authorization', token)
			res.render('weatherPage', {
				title: 'weatherPage'
			})
		}
	} catch (error) {
		res.send(error)
	}
});

routes.get('/registration', async (req, res) => {
	res.render('registration', {
		title: 'Registration'
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

routes.get('/test', (req,res)=>{
	try {
		const {authorization} = req.headers;
		jwt.verify(authorization, jwtSecret);
		res.send('ok')
	} catch (error) {
		res.send('not ok')
	}
})

routes.use(function (req, res) {
	res.status(404).send('Not found');
});


module.exports = routes;
