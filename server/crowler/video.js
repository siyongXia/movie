const puppeteer = require('puppeteer');

const videoDetaiUrl ='https://movie.douban.com/subject/'
const videoId = '27133303';

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

  await page.goto(videoDetaiUrl + videoId,{
  	waitUntil: 'networkidle2'
  });

  await sleep(1000)

  const data = await page.evaluate(() => {
  	let $ = window.$;
    let cover = $('#mainpic').find('img').attr('src');
    let videoLink = $('.related-pic-video').attr('href');
    if(cover && videoLink) {
      return {
        cover,
        videoLink
      }
    }
  	return links
  })

  let videoLink = data.videoLink

  await page.goto(videoLink,{
    waitUntil: 'networkidle2'
  });

  let videoUrl = await page.evaluate(() => {
    var $ = window.$;
    var videoUrl = $('source').attr('src');
    if(videoUrl) {
      return videoUrl
    }
    return '';
  })

  const result = {
    cover: data.cover,
    videoUrl
  }

  await browser.close();
  process.send({result: result});
  process.exit(0);
})();