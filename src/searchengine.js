class SearchEngineBase {
    constructor(log, config, urls) {
        this.log = log;         // log module of Hexo
        this.config = config;  // config for this search engine
        this.urls = urls;  // urls will be submitted
        this.count = process.env.HEXO_SEO_SUBMIT_COUNT || 10;  // default submit count is 10
    }

    submit(host) {
        throw new Error('submit not implemented!');
    }
}

module.exports = SearchEngineBase;