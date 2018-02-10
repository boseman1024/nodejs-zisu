const router = require('koa-router')()
const info = require('./info')

router.get('/info',info.getAll)

module.exports = router
