'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
    NODE_ENV: '"testing"',
    BASE_API: '"/"',
    AUTH_API: '"http://auth-qa.pnx.motie.com"',
    CONTENT_API:'"http://content-qa.pnx.motie.com"',
    FINANCE_API:'"http://finance-qa.pnx.motie.com"',
})
