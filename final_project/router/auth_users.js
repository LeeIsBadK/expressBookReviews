const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  if (username.username === undefined || username.password === undefined) {
    return false;
  }
  for (let user of users) {
    if (user.username === username.username) {
      return false;
    }
  }
  return true;
}

const authenticatedUser = (username, password) => { //returns boolean
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }
  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send({message: "User successfully logged in"});
  } else {
      return res.status(208).send({message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {


  if (req.session.authorization === undefined) {
    return res.sendStatus(403);
  }

  let token = req.session.authorization['accessToken'];
  jwt.verify(token, "access", (err, user) => {
    if (!err) {
      req.user = user;
    }
    else {
      return res.sendStatus(403);
    }
  });
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.body.reviews;
  if (books[isbn] === undefined) {
    return res.status(404).send({message: "Book not found"});
  }
  else {
    books[isbn].reviews[req.user] = review;
    console.log(books[isbn].reviews[req.user]);
    return res.status(200).send({message: "Review added successfully"});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (req.session.authorization === undefined) {
    return res.status(403).send({message: "User not authenticated"});
  }
  let token = req.session.authorization['accessToken'];
  jwt.verify(token, "access", (err, user) => {
    if (!err) {
      req.user = user;
    }
    else {
      return res.status(403).send({message: "User not authenticated" });
}});
  //Write your code here
  let isbn = req.params.isbn;
  if (books[isbn] === undefined) {
    return res.status(404).send("Book not found");
  }
  else {
    delete books[isbn].reviews[req.user];
    return res.status(200).send({message: "Review deleted successfully"});
  }

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
