const jwt = require("jsonwebtoken")

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization

    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" })
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], "az_AZ")
        req.emailUsuario = decoded.email;
        next()
    } catch (error) {
        return res.status(401).json({ message: "Token inválido" })
    }
};

module.exports = verifyToken
