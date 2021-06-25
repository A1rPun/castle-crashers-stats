module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/castle-crashers-stats/' : '/',
  outputDir: 'docs',
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'static/index.html',
    },
  },
};
