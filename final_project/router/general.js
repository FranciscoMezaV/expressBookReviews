const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password
  if(!username){
    return res.status(400).json({message: "El cuerpo no contiene el nombre de usuario"});
  }
  if(!password){
    return res.status(400).json({message: "El cuerpo no contiene la contraseña"});
  }
  if(!isValid(username)){
    return res.status(400).json({message: "El usuario ya existe"});
  }
  users.push({username: username, password: password})
  return res.status(300).json({message: "Se ha registrado el usuario"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 3)).status(300);
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn]
  if(book){
    return res.send(JSON.stringify(book, null, 3)).status(300);
  }else{
    return res.status(400).json({message: "No se encuentra el libro con el isbn"});
  }
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let bookwithauthor = [];
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if(book.author === author) bookwithauthor.push(book)
  }

  if(bookwithauthor.length > 0){
    return res.status(400).json({message: "No se encuentra el libro con el autor"});
  }
  return res.status(300).send(JSON.stringify(bookwithauthor, null, 3))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const author = req.params.title;
  let bookwithauthor = [];
  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if(book.title === author) bookwithauthor.push(book)
  }

  if(bookwithauthor.length < 1){
    return res.status(400).json({message: "No se encuentra el libro con el autor"});
  }
  return res.status(300).send(JSON.stringify(bookwithauthor, null, 3))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  let book = books[isbn]
  if(book){
    return res.status(300).send(JSON.stringify(book.reviews, null, 1));
  }else{
    return res.status(400).json({message: "No se encuentra el libro con el isbn"});
  }
});

module.exports.general = public_users;
