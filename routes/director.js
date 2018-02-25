const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Models
const Director = require('../models/Director');

router.post('/', (req, res, next) => {
  const director = new Director(req.body);
  director.save(function(){
	res.json(data);
  });
});


//tüm yönetmenleri fimleri ile birlikte gruoplayıp gösteriyor
router.get('/', (req, res) => {
	const promise = Director.aggregate([
		{
            //mongo join işlemi
			$lookup: {
				from: 'movies',
				localField: '_id',
				foreignField: 'director_id',
				as: 'movies' //hangi değişkene atanacağı
			}
		},
		{
			$unwind: {   //yukarad as ile atanan değişkeni kullanabilmek için 
				path: '$movies',
				preserveNullAndEmptyArrays: true //ilişkili olmayan alanlarıda getirir
			}
		},
		{
			$group: {
				_id: {
					_id: '$_id',
					name: '$name',
					surname: '$surname',
					bio: '$bio'
				},
				movies: {
					$push: '$movies'
				}
			}
		},
		{
			$project: {         //hangi alanların görüntüleneceği
				_id: '$_id._id',
				name: '$_id.name',
				surname: '$_id.surname',
				movies: '$movies'
			}
		}
	],function(err,data){
        res.json(data);

    });

});
   


router.get('/:director_id', (req, res) => {
    const promise = Director.aggregate([
        {
            $match: {  //girilen yönetmen id ile eşleşenleri getirsin
                '_id': mongoose.Types.ObjectId(req.params.director_id)
            }
        },
        {
            $lookup: {
                from: 'movies',
                localField: '_id',
                foreignField: 'director_id',
                as: 'movies'
            }
        },
        {
            $unwind: {
                path: '$movies',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $group: {
                _id: {
                    _id: '$_id',
                    name: '$name',
                    surname: '$surname',
                    bio: '$bio'
                },
                movies: {
                    $push: '$movies'
                }
            }
        },
        {
            $project: {
                _id: '$_id._id',
                name: '$_id.name',
                surname: '$_id.surname',
                movies: '$movies'
            }
        }
    ],function(err,data){
        res.json(data);
    });
});



router.put('/:director_id', (req, res, next) => {
	const promise = Director.findByIdAndUpdate(
		req.params.director_id,
		req.body,
		{
			new: true
		}
	);

	promise.then((director) => {
		if (!director)
			next({ message: 'The director was not found.', code: 99 });

		res.json(director);
	}).catch((err) => {
		res.json(err);
	});
});



router.delete('/:director_id', (req, res, next) => {
	const promise = Director.findByIdAndRemove(req.params.director_id,function(err,data){
        if (!director)
        next({ message: 'The director was not found.', code: 99 });
        res.json({ status: 1 });
    });	
});




router.get('/:director_id/best10movie', (req,res,next) => {
	const promise = Director.aggregate([
		{
			$match:{
				'_id': mongoose.Types.ObjectId(req.params.director_id)
			}
		},
		{
			$lookup: {
				from: 'movies',
				localField: '_id',
				foreignField: 'director_id',
				as: 'movies'
			}
		},
		{
			$unwind: '$movies'
		},
		{
			$sort: {
				'movies.imdb_score': -1
			}
		},
		{
			$limit: 10
		},
		{
			$group: {
				_id: {
					_id: '$_id'
				},
				movies: {
					$push: '$movies'
				}
			}
		},
		{
			$project: {
				_id: false,
				movies: '$movies'
			}
		}
	],function(err,data) {
        res.json(data[0].movies);
    });
});


module.exports = router;