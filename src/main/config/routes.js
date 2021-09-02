const router = require('express').Router()
const fg = require('fast-glob')

module.exports = app => {
  app.use('/api', router)
  fg.sync('**/routes/*-routes.js').forEach(file => {
    if (!file.includes('src')) {
      file = `src/main/${file}`
    }
    require(`../../../${file}`)(router)
  })
}
