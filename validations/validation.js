const autoBind = (...args) => import('auto-bind').then(({default: autoBind}) => autoBind(...args))

module.exports = class validation {
    constructor () {
        autoBind(this)
    }
}