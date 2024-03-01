const dotenv = require("dotenv")
const bcrypt = require("bcryptjs")
const { Pool } = require("pg")

dotenv.config()

const pool = new Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
    allowExitOnIdle: true,
})

const registrarUsuario = async (usuario) => {
    try {
        let { email, password, rol, lenguage } = usuario
        const passwordEncriptada = bcrypt.hashSync(password)
        password = passwordEncriptada
        const values = [email, passwordEncriptada, rol, lenguage]
        const consulta =
            "INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *;"
        await pool.query(consulta, values)
        console.log("usuario registrado")
    } catch (error) {
        console.log(error)
        return { code: 500, error }
    }
}

const verificarCredenciales = async (email, password) => {
    const values = [email]
    console.log(values)
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const {
        rows: [usuario],
        rowCount,
    } = await pool.query(consulta, values)
    const { password: passwordEncriptada } = usuario
    const passwordEsCorrecta = bcrypt.compareSync(password, passwordEncriptada)
    if (!passwordEsCorrecta || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" }
}

const obtenerRegistroEmail = async (email) => {
    try {
        const consulta = "SELECT * FROM usuarios WHERE email = $1"
        const { rows } = await pool.query(consulta, [email])

        if (rows.length === 0) {
            return { error: "Usuario no encontrado" }
        }

        const usuario = rows[0]
        return usuario
    } catch (error) {
        console.error("Error al obtener registro por email:", error)
        throw error
    }
}

module.exports = {
    registrarUsuario,
    obtenerRegistroEmail,
    verificarCredenciales,
}
