const { google } = require('googleapis');


// 使用Indexing API提交URL
async function submitUrlToIndexingAPI(auth, url) {
    const indexing = google.indexing({
        auth: auth,
        version: 'v3'
    });

    try {
        const res = await indexing.urlNotifications.publish({
            requestBody: {
                url: url,
                type: 'URL_UPDATED'
            }
        });
        return res.data;
    } catch (error) {
        console.error('Error submitting URL to Indexing API:', error);
        throw error;
    }
}
async function googleMain(hexo) {
    const log = hexo.log;
    const config = hexo.config.search_engine_submit;

    const auth = new google.auth.GoogleAuth({
        keyFile: config.google.key_file,
        scopes: ['https://www.googleapis.com/auth/indexing'],
    });

    const count = config.google.count;
    if (count > 0) {
        const data = hexo.config.submit_urls;
        log.info("===== Submitting Google urls start. =====");
        for (let i = 0; i < count; ++i) {
            log.info("Google submitting: " + data[i]);

            try {
                const resp = await submitUrlToIndexingAPI(auth, data[i]);
                log.info('Google response: ', resp);
            } catch (err) {
                log.error('Google submitting error: ', err);
            }
        }
        log.info("===== Submitting Google urls done.  =====\n");
    } else {
        log.info('Skip Google.\n');
    }
}

module.exports = googleMain;