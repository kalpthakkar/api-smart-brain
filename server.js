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

/******* For localhost *******/
// const db = knex({		// db is an alias for database
//   client: 'pg',
//   connection: {
//     host : '127.0.0.1',
//     user : 'postgres',	// Run \d command in postgress will return lists of relations (It also gives informationn about owner which here is postgres in user object) 
//     password : '',
//     database : 'Smart Brain'
//   }
// });

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('working!') })
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

/********* Table Queries *********

> Users Table
CREATE TABLE users (
	id serial PRIMARY KEY,
	name VARCHAR(100),
	email text UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL
);

> Login Table
CREATE TABLE login (
	id serial PRIMARY KEY,
	hash VARCHAR(100) NOT NULL,
	email text UNIQUE NOT NULL
);

*********************************/