const axios = require('axios');


async function BaiduMain(hexo) {
    const log = hexo.log;
    const config = hexo.config.search_engine_submit;

    let { token, count } = config.baidu;
    token = token || process.env.BAIDU_TOKEN;
    if (count > 0) {
        const data = hexo.config.submit_urls;
        log.info("===== Submitting Baidu urls start. =====");

        const parsedUrl = new URL(hexo.config.url);
        const host = parsedUrl.origin;
        const postData = data.join('\n');

        try {
            const resp = await axios.post(
                `http://data.zz.baidu.com/urls?site=${host}&token=${token}`,
                postData,
                {
                    headers: {
                        'Content-Type': 'text/plain'
                    }
                }
            );
            log.info('Baidu response: ', resp);
        } catch (err) {
            log.erroe('Baidu submitting error: ', err);
        }

        log.info("===== Submitting Baidu urls done.  =====\n");
    } else {
        log.info("Skip Baidu.\n");
    }
}

module.exports = BaiduMain;
