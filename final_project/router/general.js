const express = require('express');
let books = require("./booksdb.js");
const e = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  let user = req.body;
  if(isValid(user)){
    users.push(user);
    return res.status(200).send({message: "User successfully registered"});
  }
  else{
    return res.status(400).send({message: "User already exists"});
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    try {
      resolve(JSON.stringify(books));
    } catch (error) {
      reject(error);
    }
  })
    .then((result) => {
      return res.send(result);
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    try {
      let isbn = req.params.isbn;
      let book = books[isbn];
      if (book) {
        resolve(JSON.stringify(book));
      } else {
        reject({ message: "Book not found" });
      }
    } catch (error) {
      reject(error);
    }
  }).then((result) => {
    return res.send(result);
  }).catch((error) => {
    console.error(error);
    return res.status(404).send({ message: "Book not found" });
  })
  // let isbn = req.params.isbn;
  // let book = books[isbn];
  // if(book){
  //   return res.send(JSON.stringify(book));
  // }
  // else{
  //   return res.status(404).send({message: "Book not found"});
  // }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve, reject) => {
    try {
      let author = req.params.author;
      let res_book = [];
      for (let book in books) {
        if (books[book].author === author) {
          res_book.push(books[book]);
        }
      }

      if (res_book.length > 0) {
        resolve(JSON.stringify(res_book));
      } else {
        reject({ message: "Author not found" });
      }
    } catch (error) {
      reject(error);
    }
  }).then((result) => {
    return res.send(result);
  }).catch((error) => {
    return res.status(404).send({ message: "Author not found" });
  })

  // let author = req.params.author;
  // let res_book = [];
  // for (let book in books){
  //   if(books[book].author === author){
  //     res_book.push(books[book]);
  //   }
  // }

  // if(res_book.length > 0){
  //   return res.send(JSON.stringify(res_book));
  // }
  // else{
  //   return res.status(404).send({message: "Author not found"});
  // }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  new Promise((resolve, reject) => {
    try {
      let title = req.params.title;
      let res_book = [];
      for (let book in books) {
        if (books[book].title === title) {
          res_book.push(books[book]);
        }
      }

      if (res_book.length > 0) {
        resolve(JSON.stringify(res_book));
      } else {
        reject({ message: "Title not found" });
      }
    } catch (error) {
      reject(error);
    }
  }).then((result) => {
    return res.send(result);
  }).catch((error) => {
      return res.status(404).send({ message: "Title not found" });
    });

  // let title = req.params.title;
  // let res_book = [];
  // for (let book in books){
  //   if(books[book].title === title){
  //     res_book.push(books[book]);
  //   }
  // }

  // if(res_book.length > 0){
  //   return res.send(JSON.stringify(res_book));
  // }
  // else{
  //   return res.status(404).send({message: "Title not found"});
  // }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  if(book){
    return res.send(JSON.stringify(book.reviews));
  }
  else{
    return res.status(404).send({message: "Book not found"});
  }
});

module.exports.general = public_users;
