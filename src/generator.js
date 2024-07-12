module.exports = function (locals) {
    const log = this.log;
    const config = this.config.search_engine_submit;

    var urlsPath = config.file_path;
    log.info("Generating urls ...");

    const count = Math.max(config.google.count, config.bing.count, config.baidu.count)
    // get last posts
    var urls = [].concat(locals.posts.toArray())
        .map(function (post) {
            return {
                "date": post.updated || post.date,
                "permalink": post.permalink
            }
        })
        .sort(function (a, b) {
            return b.date - a.date;
        })
        .slice(0, count)
        .map(function (post) {
            return post.permalink;
        });

    const urlsStr = urls.join('\n');
    log.info(`${urls.length} post urls founded.`);
    log.info("Posts urls generated in " + urlsPath + "\n" + urlsStr);

    return {
        path: urlsPath,
        data: urlsStr
    };
};