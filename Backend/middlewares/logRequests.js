const logRequests = (req, res, next) => {
    console.log(`Consulta recibida: ${req.method} ${req.url}`)
    next()
}

module.exports = logRequests
