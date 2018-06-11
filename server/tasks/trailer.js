const cp = require('child_process')
const { resolve } = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async ()=> {
	let movies = await Movie.find({
		$or: [
			{ video: { $exists: false } },
			{ video: '' },
			{ cover: '' },
		]
	}).exec();

	const script = resolve(__dirname,'../crowler/video.js')
	const child = cp.fork(script, []);
	let invoked = false;

	child.on('error', err => {
		if(invoked) return
		invoked = true
		console.log(invoked);
	})
	child.on('exit', code => {
		if(invoked) return;
		invoked = true;
		let err = code == 0 ? null: new Error('exit code:' + code);
		console.log(err); 
	})
	child.on('message',async data => {

		const { result } = data

		let video = result.video
		let doubanId = result.doubanId
		let cover = result.cover

		if (video) {
			let movie = await Movie.findOne({
				doubanId: doubanId
			})
			if (movie) {
				movie.video = video
				movie.cover = cover
				await movie.save()
			} 
		}else {
			movie.remove();
			let movieTypes = movie.movieTypes
			for (var i = 0 ; i < movieTypes.length; i++) {
				let type = movieTypes[i];
				let cate = await Category.findOne({
					name: type
				})

				if(cate && cate.movies) {
					let idx = cate.movies.indexOf(movie._id)
					if(idx > -1) {
						cate.movies.splice(idx,1)
					}
					await cate.save()
				}
			}
		}
		
	})
	child.send(movies);
})()