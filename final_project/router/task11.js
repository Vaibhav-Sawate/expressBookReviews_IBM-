const express = require("express");
const axios = require("axios");
const app = express();
const PORT = 3000; // Change this to your desired port
let books = require("./booksdb.js");

// Sample endpoint for getting the list of books
app.get("/books", (req, res) => {
  // Sample book data
  const books = {
    1: { author: "Chinua Achebe", title: "Things Fall Apart", reviews: [] },
    2: { author: "Hans Christian Andersen", title: "Fairy tales", reviews: [] },
    // Add more book entries as needed
  };

  res.json(books);
});

// Sample endpoint for getting book details based on ISBN
app.get("/books/isbn/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Fetch books using Promises
const fetchBooksWithPromises = () => {
  return axios
    .get(`http://localhost:${PORT}/books`) // Ensure the URL matches your endpoint
    .then((response) => {
      console.log("Books fetched successfully:", response.data);
      return response.data; // Return data for further use
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
};

// Fetch book details based on ISBN using Promises
const fetchBookDetailsWithPromises = (isbn) => {
  return axios
    .get(`http://localhost:${PORT}/books/isbn/${isbn}`) // Ensure the URL matches your endpoint
    .then((response) => {
      console.log("Book details fetched successfully:", response.data);
      return response.data; // Return book data for further use
    })
    .catch((error) => {
      console.error("Error fetching book details:", error);
    });
};

// Fetch books using Async-Await
const fetchBooksWithAsyncAwait = async () => {
  try {
    const response = await axios.get(`http://localhost:${PORT}/books`); // Ensure the URL matches your endpoint
    console.log("Books fetched successfully:", response.data);
    return response.data; // Return data for further use
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// Fetch book details based on ISBN using Async-Await
const fetchBookDetailsWithAsyncAwait = async (isbn) => {
  try {
    const response = await axios.get(
      `http://localhost:${PORT}/books/isbn/${isbn}`
    ); // Ensure the URL matches your endpoint
    console.log("Book details fetched successfully:", response.data);
    return response.data; // Return book data for further use
  } catch (error) {
    console.error("Error fetching book details:", error);
  }
};

// Example usage
const runExample = async () => {
  console.log("Fetching all books using Promises:");
  await fetchBooksWithPromises();

  console.log("\nFetching book details for ISBN 1 using Promises:");
  await fetchBookDetailsWithPromises(1);

  console.log("\nFetching all books using Async-Await:");
  await fetchBooksWithAsyncAwait();

  console.log("\nFetching book details for ISBN 1 using Async-Await:");
  await fetchBookDetailsWithAsyncAwait(1);
};

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  runExample(); // Call the example function after the server starts
});
