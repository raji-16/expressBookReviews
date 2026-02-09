const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    if (!isValid(username)) {
      return res.status(400).json({ message: "Username already exists" });
    }
  
    // Add user to the users array
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Task 1: Get the book list
public_users.get('/', function (req, res) {
  return res.json(JSON.stringify(books, null, 4));
});

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    return res.json(book);
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

// Task 3: Get book details by author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const results = Object.values(books).filter(book => book.author === author);

  if (results.length > 0) {
    return res.json(results);
  } else {
    return res.status(404).json({ message: "No books found for this author." });
  }
});

// Task 4: Get book details by title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const results = Object.values(books).filter(book => book.title === title);

  if (results.length > 0) {
    return res.json(results);
  } else {
    return res.status(404).json({ message: "No books found with this title." });
  }
});

// Task 5: Get book reviews by ISBN
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book && book.reviews) {
    return res.json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this book." });
  }
});

module.exports.general = public_users;