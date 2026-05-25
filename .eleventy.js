const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy('src/assets');
  eleventyConfig.addPassthroughCopy('src/public');

  eleventyConfig.addFilter('icon', function (name) {
    const iconPath = path.join(__dirname, `node_modules/lucide-static/icons/${name}.svg`);
    const svg = fs.readFileSync(iconPath, 'utf8');
    return svg
      .replace(/<!--.*?-->/gs, '')
      .replace(/<svg[^>]*>/, '')
      .replace('</svg>', '')
      .trim();
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
