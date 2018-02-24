const express = require('express');
const router = express.Router();



// Models
const Movie = require('../models/Movie');


router.post('/', function(req, res, next) {
  const movie=new Movie(req.body) ;
  movie.save(function(err,data){
    if(err) console.log(err);
    res.send(data);
  });
  
});

module.exports = router;
