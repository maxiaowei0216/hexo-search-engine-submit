const path = require('path');
const util = require('./utils');
const googleSubmit = require('./google_submit');
const baiduSubmit = require('./baidu_submit');
const bingSubmit = require('./bing_submit');

async function deploy(args) {
    const f_path = path.join(this.config.public_dir, this.config.search_engine_submit.file_path);
    console.log(typeof this.config);
    // console.log(this.config);
    this.config.submit_urls = util.readUrls(f_path);

    await Promise.all([
        googleSubmit(this),
        bingSubmit(this),
        baiduSubmit(this)
    ]);
}

module.exports = deploy;