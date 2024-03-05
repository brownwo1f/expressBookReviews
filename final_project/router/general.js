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

//! Task 10

function getBookList() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}
public_users.get("/", async function (req, res) {
  try {
    const bookList = await getBookList();
    res.send(JSON.stringify(bookList));
  } catch (error) {
    res.send("Unable to get booklist");
  }
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const book = books.filter((book) => req.params.isbn == book.isbn);
  return res.send(book);
});

//! Task 11

function getFromISBN(isbn) {
  let book_ = books[isbn];
  return new Promise((resolve, reject) => {
    if (book_) {
      resolve(book_);
    } else {
      reject("Unable to find book!");
    }
  });
}
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getFromISBN(isbn).then(
    (book) => res.send(JSON.stringify(book)),
    (error) => res.send(error)
  );
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const book = books.filter((book) => req.params.author == book.author);
  return res.send(book);
});

//! Task 12

function getFromAuthor(author) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in length(books)) {
      let book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getFromAuthor(author).then((book) => res.send(JSON.stringify(book)));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const book = books.filter((book) => req.params.title == book.title);
  return res.send(book);
});

//! Task 13

function getFromTitle(title) {
  let output = [];
  return new Promise((resolve, reject) => {
    for (var isbn in length(books)) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(output);
  });
}
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getFromTitle(title).then((book) => res.send(JSON.stringify(book)));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const book = books.filter((book) => req.params.isbn == book.isbn);
  return res.send(book[0].reviews);
});

module.exports.general = public_users;
