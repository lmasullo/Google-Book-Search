//! Dependencies ************************************************
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

// Require all models
const Book = require('./models/Book');

// Set the port
const PORT = process.env.PORT || 3007;

// Initialize Express
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static('public'));

//! Connect to the Mongo DB **********************************************
// If deployed, use the deployed database. Otherwise use the local database
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/googlebooks';

// Connect to the db
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//! Routes **********************************************
app.get('/search', function(req,res){
    
    axios.get("https://www.googleapis.com/books/v1/volumes?q=1984")
    .then((response) => {
        console.log("response", response.data)
    })
    .catch((error) => {
        console.log("error", error);
    })

  });

// Route for getting all Articles from the db
app.get('/books', function(req, res) {
    // Grab every document in the Articles collection
    Book.find({})
      .populate('notes')
      .then(function(dbBook) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbBook);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


//! Start the server **********************************************
app.listen(PORT, function() {
  console.log(`App running on port ${PORT}!`);
});
