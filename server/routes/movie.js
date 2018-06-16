const Router = require('koa-router')
const mongoose = require('mongoose')
const { 
	controller, 
	get 
} = require('../lib/decoration')

const {
	getAllMovies,
	getMovieDetail,
	getRelativeMovies
} from '../service/movie'

const router = new Router();


@controller('/api/v1/movie')
export class movieController {
	@get('/')
	async getMovies(ctx, next) {
		let { type, year } = ctx.query
		const Movie = await getAllMovies(type, year)

		ctx.body = {
			movies,
			success: true
		}
	}

	@get('/:id')
	async getMovieDetail(ctx, next) {
		let { id } = ctx.params
		let movie = await getMovieDetail(id)
		let relativeMovies = await getRelativeMovies(movie)

		ctx.body = {
			data: {
				movie,
				relativeMovies
			},
			success: true
		}
	}
}