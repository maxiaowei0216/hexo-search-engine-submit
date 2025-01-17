const { google } = require('googleapis');
const SearchEngineBase = require('./searchengine');

class Google extends SearchEngineBase {
    constructor(log, config, urls) {
        super(log, config, urls);

        let key_file = this.config.key_file;
        key_file = key_file ?? 'google.json';

        this.auth = new google.auth.GoogleAuth({
            keyFile: key_file,
            scopes: ['https://www.googleapis.com/auth/indexing'],
        });
    }

    async #submitUrlToIndexingAPI(url) {
        const indexing = google.indexing({
            auth: this.auth,
            version: 'v3'
        });

        try {
            const resp = await indexing.urlNotifications.publish({
                requestBody: {
                    url: url,
                    type: 'URL_UPDATED'
                }
            });
            return resp.data;
        } catch (error) {
            this.log.error('Error submitting URL to Indexing API:', error);
            // throw error;
        }
    }

    async submit(host) {
        let count = this.config.count;
        count = count ?? this.count;
        this.log.info(`Google submit count is ${count}`);

        if (count > 0) {
            this.log.info("===== Submitting Google urls start. =====");
            for (let i = 0; i < count && i < this.urls.length; ++i) {
                let url = this.urls[i];

                this.log.info("Google submitting: " + url);
                try {
                    const resp = await this.#submitUrlToIndexingAPI(url);
                    this.log.info('Google response: ', resp);
                } catch (err) {
                    this.log.error('Google submitting error: ', err);
                }
            }
            this.log.info("===== Submitting Google urls done.  =====\n");
        } else {
            this.log.info('Skip Google.\n');
        }
    }
}

module.exports = Google;