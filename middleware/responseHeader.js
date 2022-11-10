
const publicCache = function (req, res, next) {
    res.setHeader('Cache-Control', 'public, max-age=30, must-revalidate')
    next();
}

module.exports = {
    publicCache
}