const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');
const rssModule = createRequire(__filename)('@11ty/eleventy-plugin-rss');
const pluginRss = rssModule.default || rssModule;

const pt = require('./src/_data/i18n/pt.json');
const en = require('./src/_data/i18n/en.json');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/public');

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

  eleventyConfig.addFilter('i18n', function (key, locale) {
    const data = locale === 'en' ? en : pt;
    return key.split('.').reduce((obj, k) => obj?.[k], data) ?? key;
  });

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
