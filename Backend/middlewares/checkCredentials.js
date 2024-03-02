const checkCredentials = (req, res, next) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: "Credenciales incompletas" })
    }
    next()
}

module.exports = checkCredentials
