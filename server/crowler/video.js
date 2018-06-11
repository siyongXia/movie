const puppeteer = require('puppeteer');

const videoDetaiUrl ='https://movie.douban.com/subject/'
const videoId = '3078549';

const sleep = (time) => {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, time)
	})
}

process.on('message', async movies => {
  const browser = await puppeteer.launch({
  	args: ['--no-sandbox'],
  	dumio: false
  });
  const page = await browser.newPage();
  for( let i = 0 ; i < movies.length; i++) {
    let movie = movies[i]

    await page.goto(videoDetaiUrl + movie.doubanId,{
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
    	return false
    })
    if (data) {

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
        video: videoUrl,
        doubanId: movie.doubanId
      }
      process.send({result: result});
    }
  }

  await browser.close();
  process.exit(0);
})

