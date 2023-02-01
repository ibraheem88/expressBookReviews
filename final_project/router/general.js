const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const {username,password}=req.body
  if(isValid(username)){
    users.push({username,password})
    return res.status(200).send("User Added")
  }else{
    return res.status(401).send("User already exists")
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const {isbn}=req.params
  const bookDetails=books[isbn]
  if(bookDetails){
  return res.status(200).json(bookDetails);
  }else{
    return res.status(404).json("Book not found");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author}=req.params
  const keys=Object.keys(books)
  const bookDetails=keys.filter((key)=>books[key].author===author)
  if(bookDetails.length>0){
  return res.status(200).json(books[bookDetails[0]]);
  }else{
    return res.status(404).json("Book for this author not found");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title}=req.params
  const keys=Object.keys(books)
  const bookDetails=keys.filter((key)=>books[key].title===title)
  if(bookDetails.length>0){
  return res.status(200).json(books[bookDetails[0]]);
  }else{
    return res.status(404).json("Book for this title not found");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn}=req.params
  const bookDetails=books[isbn]
  if(bookDetails){
  return res.status(200).json(bookDetails.reviews);
  }else{
    return res.status(404).json("Book not found");
  }
});

module.exports.general = public_users;
