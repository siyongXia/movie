const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { Mixed , ObjectId }= Schema.Types
const movieSchema = new Schema({
	doubanId: String,
	category: [{
		type: ObjectId,
		ref: 'Category'
	}],
	rate: Number,
	title: String,
	rawTitle: String,
	summary: String,
	video: String,
	poster: String,
	cover: String,
	videoKey: String,
	posterkey: String,
	coverKey: String,
	movieTypes: [String],
	pubdate: Mixed,
	year: Number,
	tags: [String],
	meta: {
		createdAt: {
			type: Date,
			default: Date.now()
		},
		updatedAt: {
			type: Date,
			default: Date.now()
		}
	}
})

movieSchema.pre('save', function(next) {
	if(this.isNew) {
		this.createdAt = this.updatedAt = Date.now()
	}else {
		this.updatedAt = Date.now()
	}
	next()
})

mongoose.model('Movie', movieSchema)