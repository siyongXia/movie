const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
	ctx.body = 'hellow world'
})

app.listen(3001,(err) => {
	console.log('server listen at 3001 port')
})