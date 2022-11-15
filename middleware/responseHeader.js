
const publicCache = function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=120, must-revalidate')
    next();
}

const privateCache = function (req, res, next) {
    res.setHeader('Cache-Control', 'private, max-age=10, must-revalidate')
    next();
}

const noStoreCache = function (req, res, next) {
    res.setHeader('Cache-Control', 'no-store')
    next();
}

module.exports = {
    publicCache,
    privateCache,
    noStoreCache
}