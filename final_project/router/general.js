const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 6: Register a new user
ppublic_users.post("/register", async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
  
      if (!isValid(username)) {
        return res.status(400).json({ message: "Username already exists" });
      }
  
      users.push({ username, password });
  
      return res.status(200).json({ message: "User registered successfully" });
  
    } catch (error) {
      return res.status(500).json({
        message: "Registration failed",
        error: error.message
      });
    }
  });
  
// Task 1: Get the book list
public_users.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:5000/');
      return res.status(200).json(response.data);
  
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch books",
        error: error.message
      });
    }
  });

// Task 2: Get book details by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
  
      const response = await axios.get('http://localhost:5000/');
      const book = response.data[isbn];
  
      if (!book) {
        return res.status(404).json({ message: "Book not found." });
      }
  
      return res.status(200).json(book);
  
    } catch (error) {
      return res.status(500).json({
        message: "Error retrieving book",
        error: error.message
      });
    }
  });

// Task 3: Get book details by author using Axios + async/await
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;
  
    try {
      // Fetch all books asynchronously
      const response = await axios.get('http://localhost:5000/');
  
      const booksData = response.data;
  
      const results = Object.values(booksData).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No books found for this author." });
      }
  
      return res.status(200).json(results);
  
    } catch (error) {
      console.error("Axios error:", error.message);
  
      return res.status(500).json({
        message: "Failed to retrieve books from server",
        error: error.message
      });
    }
  });

// Task 4: Get book details by title
public_users.get('/title/:title', async (req, res) => {
    try {
      const title = req.params.title;
  
      const response = await axios.get('http://localhost:5000/');
      const booksData = response.data;
  
      const results = Object.values(booksData).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
      );
  
      if (results.length === 0) {
        return res.status(404).json({ message: "No books found with this title." });
      }
  
      return res.status(200).json(results);
  
    } catch (error) {
      return res.status(500).json({
        message: "Failed to fetch books by title",
        error: error.message
      });
    }
  });
// Task 5: Get book reviews by ISBN
public_users.get('/review/:isbn', async (req, res) => {
    try {
      const isbn = req.params.isbn;
  
      const response = await axios.get('http://localhost:5000/');
      const book = response.data[isbn];
  
      if (!book || !book.reviews) {
        return res.status(404).json({ message: "No reviews found for this book." });
      }
  
      return res.status(200).json(book.reviews);
  
    } catch (error) {
      return res.status(500).json({
        message: "Error retrieving reviews",
        error: error.message
      });
    }
  });

module.exports.general = public_users;