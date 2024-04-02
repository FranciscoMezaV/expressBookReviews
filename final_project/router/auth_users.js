const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  if(users.length === 0) return true

  let user =  users.filter((user) =>{
    return user.username === username
  });

  if(user.length === 0){
    return true;
  }else{
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.username;
  const isbn = req.params.isbn;
  const newReview = req.body.review;

  // Verificar si el libro existe
  if (!books[isbn]) {
    return res.status(404).json({ message: "El libro con el ISBN proporcionado no existe" });
  }

  // Verificar si se proporcionó una reseña
  if (!newReview) {
    return res.status(400).json({ message: "Se requiere una reseña para agregar/modificar" });
  }

  // Asignar la reseña al usuario en las revisiones del libro
  books[isbn].reviews[user] = newReview;

  return res.status(200).json({ message: `La reseña del libro con ISBN ${isbn} ha sido actualizada/agregada` });
});

regd_users.delete("/auth/review/:isbn", (req, res) =>{
  const user = req.username;
  const isbn = req.params.isbn;

  // Verificar si el libro existe
  if (!books[isbn].reviews[user]) {
    return res.status(404).json({ message: "El libro con el ISBN proporcionado no existe" });
  }

  delete books[isbn].reviews[user];
  return res.status(200).json({ message: `La reseña del libro con ISBN ${isbn} ha sido eliminada` });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
