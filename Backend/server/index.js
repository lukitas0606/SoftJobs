const express = require("express")
const jwt = require("jsonwebtoken")
const cors = require("cors")

const {
    registrarUsuario,
    obtenerRegistroEmail,
    verificarCredenciales,
} = require("../utils/pg")

const checkCredentials = require("../middlewares/checkCredentials")
const verifyToken = require("../middlewares/verifyToken")
const logRequests = require("../middlewares/logRequests")

const app = express()

app.use(express.json())
app.use(cors())
app.use(logRequests)

app.post("/usuarios", checkCredentials, async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.status(201).json({ message: "Usuario registrado con éxito" })
    } catch (error) {
        console.error(error)
        res.status(error.code || 500).json(error)
    }
})

app.get("/usuarios", verifyToken, async (req, res) => {
    try {
        const perfil = await obtenerRegistroEmail(req.emailUsuario)
        res.json(perfil)
    } catch (error) {
        console.error(error)
        res.status(error.code || 500).json(error)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(error.code || 500).json(error)
    }
})

app.listen(3000, console.log("¡Servidor encendido!"))
