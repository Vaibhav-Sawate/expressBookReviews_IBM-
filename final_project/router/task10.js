const express = require("express");
const public_users = express.Router();
const axios = require("axios");

// Using Promise Callbacks
const fetchBooksWithPromises = () => {
  return axios
    .get("http://localhost:5000/") // Change PORT and endpoint as needed
    .then((response) => {
      console.log("Books fetched successfully:", response.data);
      return response.data; // return data for further use
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
};

// Using Async-Await
const fetchBooksWithAsyncAwait = async () => {
  try {
    const response = await axios.get("http://localhost:5000/"); // Change PORT and endpoint as needed
    console.log("Books fetched successfully:", response.data);
    return response.data; // return data for further use
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};

// Example usage
fetchBooksWithPromises();
fetchBooksWithAsyncAwait();

module.exports = public_users;
