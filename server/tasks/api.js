const rq = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

const fetchMovieData = async(item) => {
  if(!item.doubanId) return
	const url = `http://api.douban.com//v2/movie/${item.doubanId}`
	let res = await rq(url)
  let body 
  try {
    body = JSON.parse(res)
  }catch(err) {
    console.log(err)
  }
	return body
}

;(async () => {
	const movies = await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { summary: '' },
      { year: { $exists: false } },
      { title: '' },
    ]
  }).exec();

  for (let i = 0 ; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovieData(movie)

    if (movieData) {
      let tags = movieData.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.title || movieData.alt_title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.movieTypes.forEach(async (item) => {
          let cate = await Category.findOne({
            name: item
          })
          if (!cate) {
            cate = new Category({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (cate.movies.indexOf(movie._id) === -1) {
              cate.movies.push(movie._id)
            }
          }
          await cate.save()

          if(movie.category.length === 0) {
            movie.category.push(cate._id)
          }else {
            if(movie.category.indexOf(cate._id) === -1) {
              movie.category.push(cate._id)
            }
          }
        })

        let dates = movieData.attrs.pubdate
        let pubdates = []
        dates.map((item) => {
          if(item && item.split('(').length > 0) {
            let part = item.split('(')
            let date = part[0]
            let country = '未知'
            if (part[1]) {
              country = part[1].split(')')[0]
            }
            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })
        movie.pubdate = pubdates

        tags.forEach((item) => {
          movie.tags.push(item.name)
        })
      }

      await movie.save()
    }
  }
})()