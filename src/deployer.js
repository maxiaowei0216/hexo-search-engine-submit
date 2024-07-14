const path = require('path');
const util = require('./utils');
const Google = require('./google_submit');
const Baidu = require('./baidu_submit');
const Bing = require('./bing_submit');

async function deploy(args) {
    const f_path = path.join(this.config.public_dir, this.config.search_engine_submit.file_path);
    const submit_urls = util.readUrls(f_path);

    const config_ses = this.config.search_engine_submit;
    const google = new Google(this.log, config_ses.google, submit_urls);
    const bing = new Bing(this.log, config_ses.bing, submit_urls);
    const baidu = new Baidu(this.log, config_ses.baidu, submit_urls);

    const parsedUrl = new URL(this.config.url);
    const host = parsedUrl.origin;
    await Promise.all([
        google.submit(host),
        bing.submit(host),
        baidu.submit(host),
    ]);
}

module.exports = deploy;