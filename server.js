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

app.get('/search', function(req, res) {
  axios
    .get('https://www.googleapis.com/books/v1/volumes?q=1984')
    .then(response => {
      console.log('response', response.data);
      res.send(response.data);
    })
    .catch(error => {
      console.log('error', error);
    });
});

// Route for getting all the saved books from the db
app.get('/saved', function(req, res) {
  // Grab every document in the Articles collection
  Book.find({})
    .then(function(dbBook) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbBook);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route to save a book
app.post('/save', function(req, res) {
  // Creates a new note, then uses the new note id to enter in the articles notes array
  Book.create(req.body)
    .then(function(dbBook) {
      res.json(dbBook);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route to delete a saved book
app.post('/delete/:bookID', function(req, res) {
  console.log('bookID', req.params.bookID);
  // Delete the note
  Book.deleteOne({ _id: req.params.bookID })
    .then(function(dbBook) {
      // If we were able to successfully delete the note, send it back
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
