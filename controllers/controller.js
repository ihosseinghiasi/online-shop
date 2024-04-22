const autoBind = (...args) => import('auto-bind').then(({default: autoBind}) => autoBind(...args))

module.exports = class controller {
    constructor () {
        autoBind(this)
    }
}