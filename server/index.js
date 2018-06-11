const Koa = require('koa')
const { resolve } = require('path')
const { connect, initSchemes } = require('./database/init')

console.log(initSchemes);
const views = require('koa-views')
const Static = require('koa-static')
const mongoose = require('mongoose')

const app = new Koa()

;(async () => {
	await connect()
	
	initSchemes()

	// require('./tasks/movie')
	// require('./tasks/api')
	require('./tasks/trailer')

})();

app.use(Static(resolve(__dirname,'./static')))

app.use(views(resolve(__dirname,'./views'), {
	extension: 'pug'
}))

app.use(async (ctx, next) => {

	await ctx.render('index',{
		name: 'xiasiyong',
		place: 'website1'
	})
})

app.listen(3002,(err) => {
	if(err) return console.log(err);
	console.log('server listen at 3002 port')
})