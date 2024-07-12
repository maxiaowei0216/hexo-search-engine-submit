const axios = require('axios');


async function BingMain(hexo) {
    const log = hexo.log;
    const config = hexo.config.search_engine_submit;

    let { token, count } = config.bing;
    token = token || process.env.BING_TOKEN;
    const parsedUrl = new URL(hexo.config.url);
    const host = parsedUrl.origin;
    if (count > 0) {
        const data = hexo.config.submit_urls;
        log.info("===== Submitting Bing urls start. =====");
        for (let i = 0; i < count; ++i) {
            log.info("Bing Submitting: " + data[i]);

            let postData = {
                "siteUrl": host,
                "url": data[i]
            };

            try {
                const resp = await axios.post(
                    `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl?apikey=${token}`,
                    postData,
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                log.info('Bing response: ', resp);
            } catch (err) {
                log.erroe('Bing submitting error: ', err);
            }
        }
        log.info("===== Submitting Bing urls done.  =====\n");
    } else {
        log.info("Skip Bing.\n");
    }
};

module.exports = BingMain;