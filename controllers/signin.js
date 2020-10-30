const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body; // request comes from front-end
  if (!email || !password) {  // if email/password were kept empty and submitted (i.e. '')
    return res.status(400).json('incorrect form submission'); // sending the status is optional
  }
  db.select('email', 'hash').from('login')  // Using postgres query (login is a table defined in our database => (login=> id, hash(encrypted password), email))
    .where('email', '=', email) // conditional query to filter for requested email into the database
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash); // using bcrypt to decode hash, (returns true on match)
      if (isValid) {  // On match condition
        return db.select('*').from('users') // returning response to front-end as below
          .where('email', '=', email) // email is always unique (so to filter valid user from the database)
          .then(user => { // sending user details to the front-end (user details exist in users table =>  id(PrimaryKey),name,email,entries,joined)
            res.json(user[0]) // returning user[0] to make sure we are sending one_(filtered)_user and not the whole table
          })
          .catch(err => res.status(400).json('unable to get user')) // if credentials were valid (as per this if statement), and receieved any error (something might be wrong with server)
      } else {
        res.status(400).json('wrong credentials') // for invalid user credentials
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}