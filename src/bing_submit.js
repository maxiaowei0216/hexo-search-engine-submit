const axios = require('axios');
const SearchEngineBase = require('./searchengine');

class Bing extends SearchEngineBase {
    constructor(log, config, urls) {
        super(log, config, urls);
    }

    async submit(host) {
        let { token, count } = this.config;
        token = token ?? process.env.BING_TOKEN;
        count = count ?? this.count;

        if (count > 0) {
            this.log.info("===== Submitting Bing urls start. =====");
            for (let i = 0; i < count && i < this.urls.length; ++i) {
                let url = this.urls[i];
                let postData = {
                    "siteUrl": host,
                    "url": url
                };

                this.log.info("Bing Submitting: " + url);
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
                    this.log.info('Bing response: ', resp);
                } catch (err) {
                    this.log.erroe('Bing submitting error: ', err);
                }
            }
            this.log.info("===== Submitting Bing urls done.  =====\n");
        } else {
            this.log.info("Skip Bing.\n");
        }
    }
}

module.exports = Bing;