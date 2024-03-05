const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res
      .status(200)
      .json({ message: "Logged in successfully", Token: accessToken });
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check login credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const Review = req.body.review,
    Isbn = req.params.isbn;

  if (Review != "" && Isbn >= 1) {
    const INDEX = books.findIndex((book) => book.isbn == Isbn);

    if (INDEX >= 0) {
      books[INDEX].reviews.push(Review);
      return res.send(
        "'" + Review + "' review added to book " + books[INDEX].title
      );
    } else {
      return res.status(404).json({ message: "No corresponding book" });
    }
  } else {
    return res.status(418).json({ message: "Error" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const ISBN = req.params.isbn;

  if (ISBN) {
    const INDEX = books.findIndex((x) => x.isbn == ISBN);
    delete books[INDEX];
  }

  res.send(`Book with the isbn  ${ISBN} deleted.`);
});

module.exports.authenticated = regd_users;
module.exports.users = users;
