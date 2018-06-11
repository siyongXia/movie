const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path')

const DB = 'mongodb://localhost/movie'

mongoose.Promise = global.Promise

exports.initSchemes = () => {
	glob.sync(resolve(__dirname, './scheme', '**/*.js')).forEach(require)
}

exports.connect = () => {
	let maxConnectTimes = 0;
	return new Promise((resolve, reject) => {
		if(process.env.NODE_ENV !== 'production') {
			mongoose.set('debug', true)
		}

		mongoose.connect(DB)

		mongoose.connection.on('disconnected', () => {
			maxConnectTimes++;
			if(maxConnectTimes < 5) {
				mongoose.connect(DB)
			}else {
				throw new Error('数据库挂了!')
			}
		})

		mongoose.connection.on('error', (err) => {
			reject(err);
		})

		mongoose.connection.once('open', (err) => {
			
			resolve()
		})

	})

}