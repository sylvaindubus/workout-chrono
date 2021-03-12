module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/workout-chrono/' : '/',
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Workout Chrono'
    }
  }
}
