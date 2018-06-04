const rq = require('request-promise-native')
const url = ''

const fetchMovieData = async(item) => {
	const url = `http://api.douban.com//v2/movie/subject/${item.id}`
	const res = await rq(url)
	return res
}

;(async () => {
	const movie = [{ id: 26647117,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2517333671.jpg',
    name: '暴裂无声8.3',
    rate: '8.3' },
  { id: 6874741,
    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2507572275.jpg',
    name: '无问西东7.7',
    rate: '7.7' }]
  movie.forEach(async (item) => {
  	let data = await fetchMovieData(item);
  	data = JSON.parse(data);
  	console.log(data.title);
  })
})()