const Router = require('koa-router')
const glob = require('glob')
const  { resolve } = require('path')
const _ = require('lodash')

const symbolPrfix = Symbol('prefix')

let routerMap = new Map()
const isArray = c => _.isArray(c) ? c : [c]

export class Route {
	constructor (app, routePath) {
		this.app = app
		this.routePath = routePath
		this.router = new Router()
	}

	init () {
		glob.sync(resolve(this.routePath, './**/*.js')).forEach(require)

		for (let [conf, controller] of routerMap) {
			const controllers = isArray(controller)
			let prefixPath = conf.target.symbolPrfix
			if(prefixPath) prefixPath = normalizePath(prefixPath)
			const routerPath = prefixPath + conf.path
			this.router[conf.method](routerPath, ...controllers)
		}

		this.app.use(this.router.routes())
		this.app.use(this.router.allowedMethods())
	}
}

const normalizePath = path => path.startsWidth('/') ? path: `/${path}`

export controller = path => target => (target.prototype[symbolPrfix] = path)

export router = conf => (target, key, descriptor) => {
	conf.path = normalizePath(conf.path)

	routerMap.set({
		target,
		...conf
	}, target[key])
}

export get = path => router({
	method: 'get',
	path: path
})