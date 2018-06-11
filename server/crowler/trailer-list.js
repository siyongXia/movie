const puppeteer = require('puppeteer');
const url ='https://movie.douban.com/explore#!type=movie&tag=%E7%83%AD%E9%97%A8&sort=recommend&page_limit=20&page_start=0'

const sleep = (time) => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, time)
	})
}

;(async () => {
  const browser = await puppeteer.launch({
  	args: ['--no-sandbox'],
  	dumio: false
  });
  const page = await browser.newPage();

  await page.goto(url,{
  	waitUntil: 'networkidle2'
  });

  await sleep(3000)
  await page.waitForSelector('.more');

  for(let i = 0 ; i < 2; i++) {
  	await sleep(3000);
  	await page.click('.more');
  }

  const result = await page.evaluate(() => {
  	let $ = window.$;
  	let items = $('.list-wp a');
  	let links = [];
  	items.each((index,item) => {
  		let id = $(item).find('.cover-wp').data('id');
  		let poster = $(item).find('img').attr('src');
  		poster = poster ? poster.replace('s_ratio_poster','l_ratio_poster'): poster;
  		// let poster = $(item).find('img').attr('src').replace('s_ratio_poster','l_ratio_poster');
  		let name = $(item).find('p').text().replace(/\s/g,'');
  		let rate = $(item).find('strong').text().replace(/\s/g,'');
  		links.push({
  			doubanId: id,
  			poster,
  			name,
  			rate
  		})
  	})
  	return links
  })
  await browser.close();
  process.send({result: result});
  process.exit(0);
})();