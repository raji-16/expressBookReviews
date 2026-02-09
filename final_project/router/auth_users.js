const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Helper function to check if username is valid (i.e., not already taken)
const isValid = (username) => {
  return !users.some(user => user.username === username);
}

// Helper function to authenticate user credentials
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
}

// Login route for registered users
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
    // Generate JWT token
    const token = jwt.sign({ username }, 'access', { expiresIn: "1h" });

    // Store token in session or send to client
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add or modify a book review
regd_users.put("/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body; // read review from JSON body
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
  
    // Expecting token format: "Bearer <token>"
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing from Authorization header" });
    }
  
    try {
    //   const decoded = jwt.verify(token, 'access'); // your secret key
    //   const username = decoded.username;
  
      // Check if book exists
      if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      // Initialize reviews object if missing
      books[isbn].reviews = books[isbn].reviews || {};
  
      // Add or update the user's review
      books[isbn].reviews = review;
  
      return res.status(200).json({
        message: "Review added/updated successfully",
        reviews: books[isbn].reviews
      });
  
    } catch (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
  });

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, 'access');
    const username = decoded.username;

    if (!books[isbn] || !books[isbn].reviews || !books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found for this user" });
    }

    // Delete the user's review
    delete books[isbn].reviews[username];

    return res.status(200).json({ message: "Review deleted", reviews: books[isbn].reviews });

  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;