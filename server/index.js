const Koa = require('koa')
const app = new Koa()
const { resolve } = require('path')

const views = require('koa-views')

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