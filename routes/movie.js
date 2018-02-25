const express = require('express');
const router = express.Router();



// Models
const Movie = require('../models/Movie');

router.get('/', function(req, res, next) {
  Movie.find({ },function (err,data) {
    res.send(data);
    })
})


// Top 10 list
router.get('/top10', (req, res) => {
	const promise = Movie.find({ },function(err,data){
    res.json(data);
  }).limit(10).sort({ imdb_score: -1 });
});




router.get('/:movie_id', (req, res, next) => {
	 Movie.findById(req.params.movie_id,function(err,data){
    if (!data)
    next({ message: 'The movie was not found.', code: 99 });
    res.json(data);
   });
})


//güncelleme
router.put('/:movie_id', (req, res, next) => {
	Movie.findByIdAndUpdate(
		req.params.movie_id,
		req.body,
		{
			new: true  //yeni güncellenene verilen gelmesi için
    },
    function(err,data){
      res.json(data);
    }
  )
});



//silme
router.delete('/:movie_id', (req, res, next) => {
  const promise = Movie.findByIdAndRemove(req.params.movie_id,function(err,movie)
  {
    if (!movie)
    next({ message: 'The movie was not found.', code: 99 });
    if(err) res.json(err);
    res.json(movie);
  }
)
})




router.post('/', function(req, res, next) {
  // const { title, imdb_score, category, country, year } = req.body;
  const movie=new Movie(req.body) ;
  movie.save(function(err,data){
    if(err) res.json(err);
    res.json(data);
  });
  
});



// Between
router.get('/between/:start_year/:end_year', (req, res) => {
	const { start_year, end_year } = req.params;
Movie.find(
		{
			year: { "$gte": parseInt(start_year), "$lte": parseInt(end_year) }
		},function(err,data){
      if(err) res.json(err);
      res.json(data); 
    });
});


module.exports = router;
