const handleRegister = (req, res, db, bcrypt) => {
  const { email, name, password } = req.body; // request comes from front-end
  if (!name || !email || !password) {  // if name, email or password were kept empty and submitted (i.e. '')
    return res.status(400).json('incorrect form submission'); // sending the status(400) is optional
  }
  // (Using bcrypt Asynchronously. 
  // To implement it Synchronously, here's the documentation 
  // https://www.npmjs.com/package/bcrypt-nodejs
  bcrypt.hash(password, null, null, function(err, hash) {     // Asynchronous
    // Store hash in your password DB.
      db.transaction(trx => { // Transaction is done for propagation of one or more changes to the database.
        trx.insert({  // Creating an object to insert...
          hash: hash,
          email: email
        })
        .into('login')  // into the login table (contains => id, hash(encrypted password), email ) | Now login table is updated
        .returning('email')     // returning for further operations...
        .then(loginEmail => {   // into the user table...
          return trx('users')   // (contains => id, name, email, entries, joined)
            .returning('*') // returning all from above and date is self_created
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            .then(user => {         // sending response from the server to the front-end
              res.json(user[0]);    // user[0] to make sure we are sending one_(filtered)_user and not the whole table
            })
        })
        .then(trx.commit)     // incase transaction was successful, then commit the changes 
        .catch(trx.rollback)  // else rollback the entire transaction
      })
      .catch(err => res.status(400).json('unable to register'))
  });
}

module.exports = {
  handleRegister: handleRegister
};


