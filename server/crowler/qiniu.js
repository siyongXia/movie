const qiniu = require("qiniu")
const nanoid = require('nanoid')
const config = require('../config/')
//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = config.qiniu.AK;
qiniu.conf.SECRET_KEY = config.qiniu.SK;
//要上传的空间
const bucket = config.qiniu.bucket;
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const cfg = new qiniu.conf.Config()
const client = new qiniu.rs.BucketManager(mac, cfg)

//构造上传函数
const uploadToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
	  client.fetch(url, bucket, key, (err, ret, info) => {
	  	if(err) {
	  		reject(err)
	  	}else {
	  		if(info.statusCode === 200) {
	  			resolve({key})
	  		}else {
	  			reject(info)
	  		}
	  	}
	  })
  })
}

;(async () => {
	let movies = [{ 
		id: 3078549,
		cover: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2509632710.webp',
		poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2509632710.jpg',
		videoUrl: 'http://vt1.doubanio.com/201806101401/dce7c585738ce80d300f41da56c3adb5/view/movie/M/402310492.mp4'}];
	movies.map(async movie => {
		if(movie.videoUrl && !movie.key) {
			try {
				let coverData = await uploadToQiniu(movie.cover, nanoid() + '.webp')
				let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')
				let videoData = await uploadToQiniu(movie.videoUrl, nanoid() + '.mp4')
				if(coverData.key) {
					movie.coverKey = coverData.key
				}
				if(posterData.key) {
					movie.posterKey = posterData.key
				}
				if(videoData.key) {
					movie.videoKey = videoData.key
				}
				console.log(movie);
				// { id: 3078549,
			 //  cover: 'https://img3.doubanio.com/view/photo/s_ratio_poster/public/p2509632710.webp',
			 //  poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2509632710.jpg',
			 //  videoUrl: 'http://vt1.doubanio.com/201806101401/dce7c585738ce80d300f41da56c3adb5/view/movie/M/402310492.mp4',
			 //  coverKey: 'arITB5lKnbaP7NLXKfCNU.webp',
			 //  posterKey: 'nTrNATcpCrD060LMVvaKN.jpg',
			 //  videoKey: 'tfLiV6Tz__~gjzBBSMKYB.mp4' }
			}catch (err) {
				console.log(err);
			}
		}
	})
})();