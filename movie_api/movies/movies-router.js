const express = require('express');
const MoviesRouter = express.Router();
const Models = require('../models.js');
const Movies = Models.Movie;
const passport = require('passport');
const { check, validationResult } = require('express-validator');

//passport.authenticate('jwt', { session: false }),
MoviesRouter.get('/',  (req, res) => { /* get request for all movies */
  console.log("hi")
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err)
    });
})
  .get('/movie/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { /* get request for movie by title */
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err)
      });
  })
  .post('/', passport.authenticate('jwt', { session: false }), (req, res) => { /* adds a movie */
    Movies.findOne({ Title: req.body.Title })
      .then((movie) => {
        if (movie) {
          return res.status(400).send(req.body.Title + 'already exists');
        } else {
          Movies
            .create({
              Title: req.body.Title,
              Description: req.body.Description,
              Director: req.body.Director,
              Genre: req.body.Genre,
              ImagePath: req.body.ImagePath,
              Actors: req.body.Actors,
              Featured: req.body.Featured
            })
            .then((movie) => { res.status(201).json(movie) })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error ' + error);
      });
  })
  .put('/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { /* update a movie */
    let obj = {};
    if (req.body.Title) {
      obj.Title = req.body.Title
    }
    if (req.body.Description) {
      obj.Description = Description
    }
    if (req.body.Director) {
      obj.Director = req.body.Director
    }
    if (req.body.Genre) {
      obj.Genre = req.body.Genre
    }
    if (req.body.ImagePath) {
      obj.ImagePath = req.body.ImagePath
    }
    if (req.body.Actors) {
      obj.Actors = req.body.Actors
    }
    if (req.body.Featured) {
      obj.Featured = req.body.Featured
    }
    Movies.findOneAndUpdate({ Title: req.params.Title }, { $set: obj },
      { new: true },
      (err, updatedMovie) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedMovie);
        }
      });
  })
  .delete('/:Title', passport.authenticate('jwt', { session: false }), (req, res) => { /*  Deletes a movie from our list by title */
    Movies.findOneAndRemove({ Title: req.params.Title })
      .then((movie) => {
        if (!movie) {
          res.status(400).send(req.params.Title + ' was not found');
        } else {
          res.status(200).send(req.params.Title + ' was deleted.');
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

module.exports = MoviesRouter
