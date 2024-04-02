const express = require('express');
//let books = require("./booksdb.js");
const axios = require('axios');
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
public_users.get('/',async function (req, res) {
  //return res.send(JSON.stringify(books, null, 3)).status(300);
  try {
    const response = await axios.get("https://raw.githubusercontent.com/FranciscoMezaV/expressBookReviews/main/final_project/data.json");
    const books = response.data;
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({message: "Error al obtener la lista de los libros"})
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
  const isbn = req.params.isbn;
  /*if(book){
    return res.send(JSON.stringify(book, null, 3)).status(300);
  }else{
    return res.status(400).json({message: "No se encuentra el libro con el isbn"});
  }*/
  try {
    const response = await axios.get("https://raw.githubusercontent.com/FranciscoMezaV/expressBookReviews/main/final_project/data.json");
    const books = response.data;
    let book = books[isbn]

    if(book){
      return res.send(JSON.stringify(book, null, 3)).status(200);
    }else{
      return res.status(404).json({message: "No se encuentra el libro con el isbn"});
    }
  }catch (error) {
    return res.status(500).json({message: "Error al obtener la lista de los libros"})
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  const response = await axios.get("https://raw.githubusercontent.com/FranciscoMezaV/expressBookReviews/main/final_project/data.json");
  const books = response.data;
  let bookwithauthor = [];

  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if(book.author === author) bookwithauthor.push(book)
  }

  if(bookwithauthor.length < 1){
    return res.status(400).json({message: "No se encuentra el libro con el autor"});
  }
  return res.status(200).send(JSON.stringify(bookwithauthor, null, 3))
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  const response = await axios.get("https://raw.githubusercontent.com/FranciscoMezaV/expressBookReviews/main/final_project/data.json");
  const books = response.data;
  let bookwithtitle = [];

  let keys = Object.keys(books);
  for (let i = 0; i < keys.length; i++) {
    let book = books[keys[i]];
    if(book.title === title) bookwithtitle.push(book)
  }

  if(bookwithtitle.length < 1){
    return res.status(400).json({message: "No se encuentra el libro con el autor"});
  }
  return res.status(200).send(JSON.stringify(bookwithtitle, null, 3))
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
