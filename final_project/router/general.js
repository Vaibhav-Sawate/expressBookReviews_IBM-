const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(400).json({ message: "Username already exists." });
    }

    // Register the new user
    users[username] = { password }; // You should normally hash the password before storing it

    // Return a success message
    return res.status(201).json({ message: "User registered successfully!" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const jsonString=JSON.stringify(books);
  return res.send(jsonString);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];

    if (book) {
        // If the book is found, return it as a JSON response
        return res.status(200).json(book);
    } else {
        // If the book is not found, return a 404 error with a message
        return res.status(404).json({ message: "Book not found" });
    }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

    // Use Object.values() to get an array of books and filter by author
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    // If books were found by the given author, return them
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        // If no books by the author are found, return a 404 error
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

    // Use Object.values() to get an array of books and filter by title
    const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase() === title.toLowerCase());

    // If books were found with the given title, return them
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        // If no books with the title are found, return a 404 error
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  // Check if the book exists in the database using the ISBN
  const book = books[isbn];

  if (book) {
      // If the book is found, return the reviews
      return res.status(200).json(book.reviews);
  } else {
      // If the book is not found, return a 404 error with a message
      return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
