import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "../Online/Online.css"
import OnlineList from './OnlineList'
import Simg1 from "../../../../assets/Suggestion/avatar1.png"
import { API_URL } from '../../../../config/config'
const Online = () => {
  const [amigos, setAmigos] = useState([])  // Estado para almacenar los amigos
  const [error, setError] = useState(null)   // Estado para manejar errores

  useEffect(() => {
    const fetchAmigos = async () => {
      try {
        const token = localStorage.getItem('token')  // Obtén el token del almacenamiento local

        // Realiza la solicitud a la API para obtener los amigos
        const response = await axios.get(`${API_URL}/api/amigos/listarAmigos`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setAmigos(response.data.amigos)  // Almacena los amigos en el estado
      } catch (err) {
        console.error("Error al obtener amigos:", err)
        setError("No se pudieron cargar los amigos.")  // Maneja cualquier error de la solicitud
      }
    }

    fetchAmigos()
  }, [])

  return (
    <div className="online-comp">
      <h2>Mis Amigos</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {amigos.length > 0 ? (
        amigos.map((amigo) => (
          <OnlineList 
            key={amigo.amigo_id} 
            value={{
              profilepicture: amigo.foto_perfil ? `${API_URL}/${amigo.foto_perfil}` :`${Simg1}`, // Imagen predeterminada
              username: amigo.nombre,
              userId: amigo.amigo_id
            }}
          />
        ))
      ) : (
        !error && <p>Aun no tienes amigos</p>
      )}
    </div>
  )
}

export default Online
