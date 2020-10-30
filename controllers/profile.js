/*
    Currently this controller is not used in front-end 
    (but can be helpful in future to add-on extra functionality)
*/
const handleProfileGet = (req, res, db) => {
  const { id } = req.params;  // fetches loggedIn_user id from (front-end)_url_parameter 
  db.select('*').from('users').where({id: id})  // search query for user_id from database
    .then(user => {
      if (user.length) {  // If user_id exists
        res.json(user[0]) // id is a Primary Key so there will only be 1 row at index 0 for any search_id
      } else {
        res.status(400).json('Not found') // If no such user_id exists in users_table
      }
    })
    .catch(err => res.status(400).json('error getting user'))
}

module.exports = {
  handleProfileGet
}