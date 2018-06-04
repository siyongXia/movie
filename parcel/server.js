const Koa = require('koa')
const app = new Koa()
const { resolve } = require('path')

const Static = require('koa-static')

app.use(Static(resolve(__dirname,'./')))

app.listen(3002,(err) => {
	if(err) return console.log(err);
	console.log('server listen at 3002 port')
})