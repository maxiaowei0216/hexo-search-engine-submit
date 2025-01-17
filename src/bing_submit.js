const axios = require('axios');
const SearchEngineBase = require('./searchengine');

class Bing extends SearchEngineBase {
    constructor(log, config, urls) {
        super(log, config, urls);
    }

    async getQuotaLimit(host, token) {
        try {
            const resp = await axios.get(
                `https://ssl.bing.com/webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=${host}&apikey=${token}`,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            return resp.data.d.DailyQuota;
        } catch (err) {
            this.log.error('Failed to get Bing quota:', err);
            return 0;
        }
    }

    async submit(host) {
        let { token, count } = this.config;
        token = token || process.env.BING_TOKEN;
        count = count ?? this.count;

        if (!token || token.length == 0) {
            this.log.error('Bing token is invalid, please set it within the _config.yml or via environment variable BING_TOKEN');
            return;
        }

        // Get available quota
        const quota = await this.getQuotaLimit(host, token);
        if (quota <= 0) {
            this.log.info("No available Bing submission quota for today, skipping...\n");
            return;
        }

        const submitCount = Math.min(quota, count, this.urls.length);

        if (submitCount > 0) {
            this.log.info(`===== Submitting ${submitCount} Bing urls in batch. =====`);

            const urlList = this.urls.slice(0, submitCount);
            this.log.info('Bing urls to submit:');
            urlList.forEach(url => this.log.info(url));

            try {
                const resp = await axios.post(
                    `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlBatch?apikey=${token}`,
                    {
                        "siteUrl": host,
                        "urlList": urlList
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                this.log.info('Bing batch submission response: ', resp.data);
            } catch (err) {
                this.log.error('Bing batch submission error: ', err);
            }

            this.log.info("===== Submitting Bing urls done.  =====\n");
        } else {
            this.log.info("Skip Bing.\n");
        }
    }
}

module.exports = Bing;