const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000; // Change this to your desired port
let books = require("./booksdb.js");

app.get("/books/author/:author", (req, res) => {
  const author = req.params.author;

  // Filter books by author
  const booksByAuthor = Object.values(books).filter(
    (book) => book.author.toLowerCase() === author.toLowerCase()
  );

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found by this author" });
  }
});

// Fetch books based on author using Promises
const fetchBooksByAuthorWithPromises = (author) => {
  return axios
    .get(`http://localhost:${PORT}/books/author/${author}`)
    .then((response) => {
      console.log("Books by author fetched successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching books by author:", error);
    });
};

// Fetch books based on author using Async-Await
const fetchBooksByAuthorWithAsyncAwait = async (author) => {
  try {
    const response = await axios.get(
      `http://localhost:${PORT}/books/author/${author}`
    );
    console.log("Books by author fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by author:", error);
  }
};

// Example usage of both methods
const runExample = async () => {
  console.log("Fetching books by author 'Chinua Achebe' using Promises:");
  await fetchBooksByAuthorWithPromises("Chinua Achebe");

  console.log("\nFetching books by author 'Chinua Achebe' using Async-Await:");
  await fetchBooksByAuthorWithAsyncAwait("Chinua Achebe");
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  runExample(); // Call the example function after the server starts
});
