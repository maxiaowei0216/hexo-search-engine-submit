const path = require('path');
const util = require('./utils');
const Google = require('./google_submit');
const Baidu = require('./baidu_submit');
const Bing = require('./bing_submit');

async function deploy(args) {
    try {
        // Validate configuration
        if (!this.config.search_engine_submit) {
            this.log.error('search_engine_submit configuration not found');
            return;
        }

        if (!this.config.url) {
            this.log.error('Blog URL configuration not found');
            return;
        }

        // Read URLs from file
        const f_path = path.join(this.config.public_dir, this.config.search_engine_submit.file_path);
        const submit_urls = util.readUrls(f_path);
        
        if (!submit_urls || submit_urls.length === 0) {
            this.log.warn('No URLs found to submit');
            return;
        }
        this.log.info(`Found ${submit_urls.length} URLs to submit`);

        // Initialize search engine instances
        const config_ses = this.config.search_engine_submit;
        const engines = {
            google: new Google(this.log, config_ses.google, submit_urls),
            bing: new Bing(this.log, config_ses.bing, submit_urls),
            baidu: new Baidu(this.log, config_ses.baidu, submit_urls)
        };

        // Parse website domain
        const parsedUrl = new URL(this.config.url);
        const host = parsedUrl.origin;

        // Submit URLs to search engines sequentially
        this.log.info('Start submitting URLs to search engines...\n');
        
        // Google submission
        try {
            await engines.google.submit(host);
        } catch (err) {
            this.log.error('Google submission failed:', err);
        }

        // Bing submission
        try {
            await engines.bing.submit(host);
        } catch (err) {
            this.log.error('Bing submission failed:', err);
        }

        // Baidu submission
        try {
            await engines.baidu.submit(host);
        } catch (err) {
            this.log.error('Baidu submission failed:', err);
        }

        this.log.info('URL submission completed');
    } catch (err) {
        this.log.error('URL submission failed:', err);
    }
}

module.exports = deploy;