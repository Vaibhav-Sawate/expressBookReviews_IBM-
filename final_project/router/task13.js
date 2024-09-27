const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000; // Change this to your desired port
let books = require("./booksdb.js");

// Endpoint for getting books based on title
app.get("/books/title/:title", (req, res) => {
  const title = req.params.title;

  // Filter books by title
  const booksByTitle = Object.values(books).filter(
    (book) => book.title.toLowerCase() === title.toLowerCase()
  );

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Fetch books based on title using Promises
const fetchBooksByTitleWithPromises = (title) => {
  return axios
    .get(`http://localhost:${PORT}/books/title/${title}`)
    .then((response) => {
      console.log("Books by title fetched successfully:", response.data);
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching books by title:", error);
    });
};

// Fetch books based on title using Async-Await
const fetchBooksByTitleWithAsyncAwait = async (title) => {
  try {
    const response = await axios.get(
      `http://localhost:${PORT}/books/title/${title}`
    );
    console.log("Books by title fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching books by title:", error);
  }
};

// Example usage of both methods
const runExample = async () => {
  console.log(
    "Fetching books with title 'Pride and Prejudice' using Promises:"
  );
  await fetchBooksByTitleWithPromises("Pride and Prejudice");

  console.log(
    "\nFetching books with title 'Pride and Prejudice' using Async-Await:"
  );
  await fetchBooksByTitleWithAsyncAwait("Pride and Prejudice");
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  runExample(); // Call the example function after the server starts
});
