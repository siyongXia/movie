class Boy {
	@speak('中文')
	run () {
		console.log('I Am Running')
		console.log('I can speak' + this.language)
	}
}

function speak(language) {
	return function (target, key) {
		target.language = language
		console.log(target)
		console.log(key)
	}
}

const luke = new Boy()

// luke.run();