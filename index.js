const config = hexo.config.search_engine_submit;

if (config?.enable) {
    hexo.extend.generator.register('submit_url_generator', require('./src/generator'));
    hexo.extend.deployer.register('search_engine_submit', require('./src/deployer'));
}
