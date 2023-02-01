const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username:"Ali",
password:"123"}];
const JWT_SECRET="UZIB"

const isValid = (username)=>{ 
  const userExists=users.filter((user)=>user.username===username)
  if(userExists.length>0){
    return false
  }else{
    return true
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let authenticated
  users.filter((user)=>{
    if(
user.username===username && user.password === password
    ){
      authenticated=true
    }
  })
if(authenticated){
  return true
}else{
  return false
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password}=req.body
  if(authenticatedUser(username,password)){
    let token=jwt.sign({username},JWT_SECRET,{expiresIn: 60*60})
    req.session.authorization={
      token
    }
    return res.status(200).send("User Logged In")
  }else{
    return res.status(401).send("Invalid Credentials")
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const {review}=req.body
  const {isbn}=req.params
  const book=books[isbn]
  if(book){
  const updatedBook={...book,reviews:[...book.reviews,review]}
  res.status(200).json(updatedBook.reviews)
  }else{
    res.status(404).json("Book with given ISBN not found")
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
