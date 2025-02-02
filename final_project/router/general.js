const axios = require('axios');
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }


  public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the username already exists
        if (!doesExist(username)) { 
            // Add the new user to the users array
            users.push({ username: username, password: password });
            // Return a success response
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            // If the username already exists, return an error response
            return res.status(409).json({ message: "User already exists!" });
        }
    } else {
        // If either username or password is missing, return an error response
        return res.status(400).json({ message: "Both username and password are required" });
    }
});


// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify({books},null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});*/

public_users.get('/', function (req, res) {
    // Make a GET request to fetch the list of books
    axios.get('https://raw.githubusercontent.com/MTOUZAN/expressBookReviews/main/final_project/router/booksdb.js')
        .then(response => {
            // Send the list of books available in the shop
            res.send(response.data);
        })
        .catch(error => {
            // Handle errors
            console.error('Error fetching books:', error);
            res.status(500).send('Internal Server Error');
        });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = parseInt(req.params.isbn);
    
    let myPromise = new Promise((resolve, reject) => {
        // Simulate a delay of 6 seconds using setTimeout
        setTimeout(() => {
            // Filter the books based on the author
            let filtered_books = books[isbn]           
            // Resolve the promise with the filtered books
            resolve(filtered_books );
        }, 3000);
    });

    // Handle the resolved promise
    myPromise.then((filtered_books) => {
        // Send the filtered books as a JSON response
        res.status(200).json(filtered_books);
    }).catch((error) => {
        // Handle any errors that occur during the asynchronous operation
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });
  });


  public_users.get('/author/:author', function (req, res) {
    // Get the author from the request parameters
    const author = req.params.author;
  
    // Create a promise to handle the asynchronous operation
    let myPromise = new Promise((resolve, reject) => {
        // Simulate a delay of 6 seconds using setTimeout
        setTimeout(() => {
            // Filter the books based on the author
            let filtered_books = Object.values(books).filter((book) => book.author === author);
            
            // Resolve the promise with the filtered books
            resolve(filtered_books);
        }, 3000);
    });

    // Handle the resolved promise
    myPromise.then((filtered_books) => {
        // Send the filtered books as a JSON response
        res.status(200).json(filtered_books);
    }).catch((error) => {
        // Handle any errors that occur during the asynchronous operation
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });
});




// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
    const title = req.params.title;
    let filtered_books = Object.values(books).filter((book) => book.title === title);
    res.status(200).json(filtered_books[0]);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Get the author from the request parameters
    const title = req.params.title;
  
    // Create a promise to handle the asynchronous operation
    let myPromise = new Promise((resolve, reject) => {
        // Simulate a delay of 6 seconds using setTimeout
        setTimeout(() => {
            // Filter the books based on the author
            let filtered_books = Object.values(books).filter((book) => book.title === title);
            
            // Resolve the promise with the filtered books
            resolve(filtered_books);
        }, 3000);
    });

    // Handle the resolved promise
    myPromise.then((filtered_books) => {
        // Send the filtered books as a JSON response
        res.status(200).json(filtered_books);
    }).catch((error) => {
        // Handle any errors that occur during the asynchronous operation
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    });
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = parseInt(req.params.isbn);
  res.status(200).json(books[isbn].reviews);
  
});



module.exports.general = public_users;
