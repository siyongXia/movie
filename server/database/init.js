const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path')

const DB = 'mongodb://localhost/movie'

mongoose.Promise = global.Promise

exports.initSchemes = () => {

	glob.sync(resolve(__dirname, './scheme', '**/*.js')).forEach(require)

}

exports.initAdmin = async () => {
	const User = mongoose.model('User');
	let user = await User.findOne({
		username: 'xsy'
	})
	
	if(!user) {
		let user = new User({
			username: 'xsy',
			email: '514123901@qq.com',
			password: '514123901'
		})
		await user.save();
	}
	
}


exports.connect = () => {
	let maxConnectTimes = 0;
	return new Promise((resolve, reject) => {
		if(process.env.NODE_ENV !== 'production') {
			mongoose.set('debug', true)
		}

		console.log('first connect')
		mongoose.connect(DB)

		mongoose.connection.on('disconnected', (err) => {
			maxConnectTimes++;
			console.log(maxConnectTimes)
			if(maxConnectTimes < 5) {
				mongoose.connect(DB)
			}else {
				throw new Error('数据库挂了!')
			}
		})

		mongoose.connection.on('error', (err) => {
			console.log(err);
			reject(err);
		})

		mongoose.connection.once('open', (err) => {
			resolve()
		})

	})

}