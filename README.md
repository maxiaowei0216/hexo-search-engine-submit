
# hexo-search-engine-submit


The plugin [hexo-submit-urls-to-search-engine](https://github.com/cjh0613/hexo-submit-urls-to-search-engine) has been rewritten to replace the deprecated `request` package with `axios`. The `request` package is no longer maintained, and the original author is not actively maintaining this plugin. To ensure compatibility with modern dependencies and to keep the plugin functional, I have updated it by using `axios` as a supported alternative.

I have removed features that the original author did not implement and those with low usage. These features may be added back in the future.

## Usage

### Edit Hexo _config.yml
#### (1) search_engine_submit

 
```yaml
search_engine_submit:
  enable: true  # Enable or disable this plugin.
  file_path: submit_urls.txt    # The address of the text document, the link to be pushed will be saved in this text document.
  google:
    key_file: ""     # Store the json file of the google key in the root directory of the website (same location as the hexo _config.yml file), please do not publish the source code of the website in the public warehouse!
    count: 10     # Number of urls to submit. Setting it to 0 will skip this search engine.
  bing:
    token: ""     # This can be specified via the environment variable BING_TOKEN.
    count: 10
  baidu:
    token: ""     # This can be specified via the environment variable BAIDU_TOKEN.
    count: 10
```

#### (2) deploy
```yaml
deploy:
- type: search_engine_submit
```
