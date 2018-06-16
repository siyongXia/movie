const qiniu = require("qiniu")
const nanoid = require('nanoid')
const config = require('../config/')

const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

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
	let movies = await Movie.find({
		$or: [
			{ viedoKey: { $exists: false } },
			{ viedoKey: null },
			{ viedoKey: '' }
		]
	})
	for(var i = 0 ; i < movies.length; i++) {
		let movie = movies[i];
		if(movie.video && !movie.key) {
			try {
				console.log('开始上传cover')
				let coverData = await uploadToQiniu(movie.cover, nanoid() + '.webp')

				console.log('开始上传posterData')
				let posterData = await uploadToQiniu(movie.poster, nanoid() + '.jpg')

				console.log('开始上传videoData')
				let videoData = await uploadToQiniu(movie.video, nanoid() + '.mp4')

				if(coverData.key) {
					movie.coverKey = coverData.key
				}
				if(posterData.key) {
					movie.posterKey = posterData.key
				}
				if(videoData.key) {
					movie.videoKey = videoData.key
				}
			}catch (err) {
				console.log(err);
			}
		}
	}
})();