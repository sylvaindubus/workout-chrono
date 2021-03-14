module.exports = {
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Workout Chrono'
    }
  },
  pwa: {
    iconPaths: {
      faviconSVG: 'favicon.svg',
      favicon32: 'favicon-32x32.png',
      favicon16: 'favicon-16x16.png',
      appleTouchIcon: 'apple-touch-icon.png',
      maskIcon: 'safari-pinned-tab.svg',
      msTileImage: 'mstile-150x150.png'
    },
    themeColor: '4b6584',
    msTileColor: '#4b6584'
  }
}
