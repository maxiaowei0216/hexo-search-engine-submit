const axios = require('axios');
const SearchEngineBase = require('./searchengine');

class Baidu extends SearchEngineBase {
    constructor(log, config, urls) {
        super(log, config, urls);
    }

    async submit(host) {
        let { token, count } = this.config;
        token = token || process.env.BAIDU_TOKEN;
        count = count ?? this.count;

        if(token.length == 0) {
            this.log.error('Baidu token is invalid, please set it within the _config.yml or via environment variable BAIDU_TOKEN');
            return;
        }

        if (count > 0) {
            this.log.info("===== Submitting Baidu urls start. =====");

            try {
                const postData = this.urls.join('\n');
                const resp = await axios.post(
                    `http://data.zz.baidu.com/urls?site=${host}&token=${token}`,
                    postData,
                    {
                        headers: {
                            'Content-Type': 'text/plain'
                        }
                    }
                );
                this.log.info('Baidu response: ', resp.data);
            } catch (err) {
                this.log.error('Baidu submitting error: ', err);
            }

            this.log.info("===== Submitting Baidu urls done.  =====\n");
        } else {
            this.log.info("Skip Baidu.\n");
        }
    }
}

module.exports = Baidu;
