const Router = require('koa-router')
const mongoose = require('mongoose')
const { 
	controller, 
	post 
} = require('../lib/decoration')

const {
	checkPassword,
} from '../service/user'

const router = new Router();


@controller('/api/v1/user')
export class userController {
	@post('/')
	async login(ctx, next) {
		let { email, password } = ctx.request.body
		const matchData = await checkPassword(type, year)
		
		if(matchData.match) {
			return (ctx.body = {
				success: true
			})
		}
		return (ctx.body = {
			success: false,
			msg: '用户名或密码不存在'
		})
	}
}