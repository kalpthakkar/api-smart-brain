const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');	// Using npm package bcrypt to encrypt password
const cors = require('cors');
const knex = require('knex')	// Using npm package knex to connect server with database

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({		// db is an alias for database
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
	  ssl: {
	    rejectUnauthorized: false
	  }
  }
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(database.users) })
app.post('/signin', signin.handleSignin(db, bcrypt))
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) }) // Currently this controller is not in use with front-end application (but can be helpful in future to add-on extra functionality)
app.put('/image',  (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})

app.listen(process.env.PORT || 3001, () => {
	console.log(`App is running on port ${process.env.PORT}`);
})

/*********** Overview ***********
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*********************************/