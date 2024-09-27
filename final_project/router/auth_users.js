const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  return username && username.length > 0 && !users[username];
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const user = users[username]; // Access the user by username
  return user && user.password === password;
};

regd_users.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if the username already exists
  if (users[username]) {
    return res.status(400).json({ message: "Username already exists." });
  }

  // Register the new user
  users[username] = { password }; // Store the user with plaintext password

  // Return a success message
  return res.status(201).json({ message: "User registered successfully!" });
});

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  }

  // Check if the user is authenticated
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  // Create a JWT token
  const token = jwt.sign({ username }, "your_secret_key", { expiresIn: "1h" }); // Use your actual secret key

  // Save the token in the session
  req.session.username = username; // Store the token in the session
  req.session.authorization = { accessToken: token };

  // Return the token in the response
  return res.status(200).json({ message: "Login successful!", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const { isbn } = req.params;
  const { review } = req.body;
  const username = req.session.username; // Retrieve the username from the session

  // Check if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  // Check if the review is provided
  if (!review) {
    return res.status(400).json({ message: "Review text is required." });
  }

  if (!books[isbn].reviews) {
    books[isbn].reviews = []; // Initialize it as an array if it doesn't exist
  }
  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Find the user's existing review
  const existingReviewIndex = books[isbn].reviews.findIndex(
    (r) => r.username === username
  );

  if (existingReviewIndex !== -1) {
    // If a review exists from this user, update it
    books[isbn].reviews[existingReviewIndex].review = review;
    return res.status(200).json({ message: "Review updated successfully!" });
  } else {
    // If no review exists, add a new one
    books[isbn].reviews.push({ username, review });
    return res.status(201).json({ message: "Review added successfully!" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.username; // Retrieve the username from the session

  // Check if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "User not authenticated." });
  }

  // Check if the book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found." });
  }

  // Filter out the review from the user's reviews
  const originalReviews = books[isbn].reviews;
  const filteredReviews = originalReviews.filter(
    (review) => review.username !== username
  );

  // Check if any review was deleted
  if (originalReviews.length === filteredReviews.length) {
    return res.status(404).json({ message: "No review found to delete." });
  }

  // Update the reviews for the book
  books[isbn].reviews = filteredReviews;

  return res.status(200).json({ message: "Review deleted successfully!" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
