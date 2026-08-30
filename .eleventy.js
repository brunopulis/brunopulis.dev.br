const { createRequire } = require('module');
const rssModule = createRequire(__filename)('@11ty/eleventy-plugin-rss');
const pluginRss = rssModule.default || rssModule;

const { faIcon, i18n } = require('./src/_data/filters');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/public');
  eleventyConfig.addPassthroughCopy({
    'node_modules/@fortawesome/fontawesome-free/webfonts': 'assets/webfonts'
  });

  eleventyConfig.addPlugin(pluginRss);

  eleventyConfig.addCollection('pages', function (collectionApi) {
    return collectionApi.getAll().filter(function (item) {
      return item.data.title && item.data.permalink !== '/en/';
    }).sort(function (a, b) {
      return a.date - b.date;
    }).reverse();
  });

  eleventyConfig.addFilter('icon', function (name) {
    const iconPath = path.join(__dirname, `node_modules/lucide-static/icons/${name}.svg`);
    const svg = fs.readFileSync(iconPath, 'utf8');
    return svg
      .replace(/<!--.*?-->/gs, '')
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '')
      .trim();
  });

  // Mapeia nomes de ícones usados no i18n (herdados do lucide) para classes do Font Awesome 7.
  eleventyConfig.addFilter('faIcon', faIcon);

  eleventyConfig.addFilter('i18n', i18n);

  return {
    markdownTemplateEngine: 'njk',

    dir: {
      output: '_site',
      input: 'src',
      data: '_data',
      includes: '_includes',
      layouts: '_layouts'
    }
  };
};
