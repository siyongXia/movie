const mongoose = require('mongoose')
const User = mongoose.model('User')

export const checkPassword = async (email, password) => {
	let user = await User.find({email})

	let match = false

	if(user) {
		match = await user.comparePassword(password, user.password)
	}

	return {
		match,
		user
	}

}