module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: [
        'Chrome >= 49',
        'Firefox >= 52',
        'Safari >= 10',
        'Edge >= 14',
        'ie >= 11',
        'last 2 versions'
      ]
    }
  }
};