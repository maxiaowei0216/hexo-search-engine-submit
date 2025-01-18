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

    async #submitUrlBatch(urls, batchSize = 100) {
        const indexing = google.indexing({
            auth: this.auth,
            version: 'v3'
        });

        const results = [];
        const errors = [];

        // Process URLs in chunks
        for (let i = 0; i < urls.length; i += batchSize) {
            const chunk = urls.slice(i, i + batchSize);
            const promises = chunk.map(url => 
                indexing.urlNotifications.publish({
                    requestBody: {
                        url: url,
                        type: 'URL_UPDATED'
                    }
                }).catch(error => {
                    errors.push({ url, error });
                    return null;
                })
            );

            const responses = await Promise.all(promises);
            results.push(...responses.filter(r => r !== null));
            
            // Add a small delay between batches to avoid rate limiting
            if (i + batchSize < urls.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return { results, errors };
    }

    async submit(host) {
        let count = this.config.count;
        count = count ?? this.count;
        const submitCount = Math.min(count, this.urls.length);

        if (submitCount > 0) {
            this.log.info(`===== Submitting ${submitCount} Google urls start. =====`);
            
            const urlsToSubmit = this.urls.slice(0, submitCount);
            this.log.info('Google urls to submit:');
            urlsToSubmit.forEach(url => this.log.info(url));

            const { results, errors } = await this.#submitUrlBatch(urlsToSubmit);
            
            // Log results
            this.log.info(`Successfully submitted ${results.length} URLs`);
            if (errors.length > 0) {
                this.log.error(`Failed to submit ${errors.length} URLs:`);
                errors.forEach(({ url, error }) => {
                    this.log.error(`URL: ${url}, Error: ${error.message}`);
                });
            }

            this.log.info("===== Submitting Google urls done.  =====\n");
        } else {
            this.log.info('Skip Google.\n');
        }
    }
}

module.exports = Google;