const express = require("express");
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const jwt = require("jsonwebtoken");
const public_users = express.Router();

const doesExist = (username) => {
  let userExist = users.filter((user) => {
    return user.username === username;
  });
  if (userExist.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred, Proceed to login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const book = books.filter((book) => req.params.isbn == book.isbn);
  return res.send(book);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const book = books.filter((book) => req.params.author == book.author);
  return res.send(book);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const book = books.filter((book) => req.params.title == book.title);
  return res.send(book);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books.filter((book) => req.params.isbn == book.isbn);
  return res.send(book[0].reviews);
});

module.exports.general = public_users;
