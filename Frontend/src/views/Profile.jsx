import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Context from '../contexts/Context'
import { ENDPOINT } from '../config/constans'

const Profile = () => {
  const navigate = useNavigate()
  const { getDeveloper, setDeveloper } = useContext(Context)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getDeveloperData = async () => {
      try {
        setLoading(true)
        const token = window.sessionStorage.getItem('token')
        console.log(token)
        const response = await axios.get(ENDPOINT.users, { headers: { Authorization: `Bearer ${token}` } })
        const user = response.data

        if (user) {
          setDeveloper({ ...user })
        } else {
          console.error("La respuesta del servidor no tiene la estructura esperada.")
        }
      } catch (error) {
        console.error("Error en la solicitud:", error.message)
        if (error.response && error.response.status === 401) {
          console.error("Usuario no autenticado. Redirigiendo a la página de inicio de sesión.")
          window.sessionStorage.removeItem('token')
          setDeveloper(null)
          navigate('/')
        }
      } finally {
        setLoading(false)
      }
    };

    getDeveloperData()
  }, [])

  return (
    <div className='py-5'>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <h1>
            Bienvenido <span className='fw-bold'>{getDeveloper?.email}</span>
          </h1>
          <h3>
            {getDeveloper?.rol} en {getDeveloper?.lenguage}
          </h3>
        </>
      )}
    </div>
  );
};

export default Profile
