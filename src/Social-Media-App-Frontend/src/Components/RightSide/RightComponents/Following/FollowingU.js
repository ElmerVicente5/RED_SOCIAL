import React, { useEffect, useState } from 'react'
import axios from 'axios'
import "../Following/FollowingU.css"
import FollowingUList from './FollowingUList'
import FollowingMore from './FollowingMore'

const FollowingU = ({ following, setFollowing }) => {
  const [solicitudes, setSolicitudes] = useState([]) // Estado para almacenar las solicitudes
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const fetchSolicitudes = async () => {
      try {
        const token = localStorage.getItem('token') // Obtén el token del almacenamiento local

        // Realiza la solicitud a la API para obtener las solicitudes
        const response = await axios.get('http://localhost:8000/api/amigos/solicitudes', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setSolicitudes(response.data) // Almacena las solicitudes en el estado
      } catch (err) {
        console.error("Error al obtener las solicitudes:", err)
        // Maneja errores si es necesario
      }
    }

    fetchSolicitudes() // Llama a la función para obtener las solicitudes
  }, [])

  return (
    <div className="following-comp">
      <h2>Solicitudes de amistad</h2>
      
      {solicitudes.length > 0 ? (
        solicitudes.map((data) => (
          <FollowingUList 
            following={following}
            setFollowing={setFollowing}
            data={data} // Pasa la solicitud al componente
            key={data.friend_id} // Usa friend_user_id como clave única
          />
        ))
      ) : (
        <p>No tienes solicitudes pendientes.</p>
      )}
      
      <FollowingMore 
        showMore={showMore}
        setShowMore={setShowMore}
      />
      
      {showMore && <button className='SM-btn' onClick={() => setShowMore(false)}>Show less</button>}
    </div>
  )
}

export default FollowingU
