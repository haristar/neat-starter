const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
    "./node_modules/prismjs/themes/prism-tomorrow.css":
      "./static/css/prism-tomorrow.css",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy Public Folder (where your HTML and assets are located)
  eleventyConfig.addPassthroughCopy("./src/public");

  // If you want specific folders, uncomment the lines below
  // eleventyConfig.addPassthroughCopy("./src/public/css");
  // eleventyConfig.addPassthroughCopy("./src/public/assets");
  // eleventyConfig.addPassthroughCopy("./src/public/forms");
  // eleventyConfig.addPassthroughCopy("./src/public/providers");

  // Copy favicon to root of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/priv");
  eleventyConfig.addPassthroughCopy("./src/public");
  eleventyConfig.addPassthroughCopy("./src/demo");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  eleventyConfig.setTemplateFormats([
    "html",
    "njk",
    "md", // If you have markdown files
  ]);

  return {
    dir: {
      input: "src",      // Input directory
      output: "_site",   // Output directory
      includes: "_includes", // Directory for includes
      data: "_data",     // Directory for global data files
    },
    htmlTemplateEngine: "njk", // Use Nunjucks for HTML templates
  };
};
