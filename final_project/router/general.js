const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username, "password":password});
      return res.status(200).json({message: "Customer successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered_books = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].author === author) {
      filtered_books.push({
        "isbn": key,
        "title": books[key].title,
        "reviews": books[key].reviews
      });
    }
  });
  return res.status(200).json(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered_books = [];
  let keys = Object.keys(books);
  keys.forEach((key) => {
    if(books[key].title === title) {
      filtered_books.push({
        "isbn": key,
        "author": books[key].author,
        "reviews": books[key].reviews
      });
    }
  });
  return res.status(200).json(filtered_books);
});

// Get book review based on ISBN
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});

// ==========================================
// AXIOS IMPLEMENTATIONS (Async/Await & Promises)
// ==========================================

// Task 10: Get all books using async/await with Axios
const getAllBooksAsync = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Task 11: Get book details by ISBN using Axios/Promises
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Task 12: Get book details by Author using Axios/Promises
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/author/${author}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

// Task 13: Get book details by Title using Axios/Promises
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/title/${title}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};

module.exports.general = public_users;
