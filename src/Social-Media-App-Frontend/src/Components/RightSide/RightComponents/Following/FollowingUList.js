import React, { useState } from 'react'
import axios from 'axios';
import Simg1 from "../../../../assets/Suggestion/avatar1.png"
import { API_URL } from '../../../../config/config';

const FollowingUList = ({ data, following, setFollowing }) => {
  const [status, setStatus] = useState("Aceptar"); // Estado para manejar el texto del botón
  const [isClicked, setIsClicked] = useState(false);

  const handleResponse = async (estado) => {
    try {
      const token = localStorage.getItem('token'); // Obtén el token del almacenamiento local
      const response = await axios.post(`${API_URL}/api/amigos/estadoSolicitud`, {
        solicitudId: data.friend_id, // Usa el id de la solicitud
        estado: estado // Estado a enviar (aceptado o rechazado)
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Puedes manejar la respuesta aquí si es necesario
      console.log("Respuesta de la API:", response.data);
      
      // Actualiza el estado de la interfaz dependiendo de la respuesta
      if (estado === "aceptado") {
        setStatus("Solicitud aceptada");
      } else {
        setStatus("Solicitud rechazada");
      }
      
      setIsClicked(true); // Cambia el estado de clic
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      // Maneja errores si es necesario
    }
  }

  return (
    <div className="following-people">
      <div className="following-details">
        <img src={data.foto_perfil ? `${API_URL}/${data.foto_perfil}`: `${Simg1}`} alt="" /> {/* Imagen por defecto si es necesario */}
        <div className="following-name-username">
          <h3>{data.nombre}</h3> {/* Muestra el nombre del amigo */}
          <p>{data.friend_id}</p> {/* O el username si es necesario */}
        </div>
      </div>

      {/* Botón para aceptar la solicitud */}
      <button
        style={{
          background: isClicked ? "transparent" : "linear-gradient(107deg, rgb(255, 67, 5) 11.1%, rgb(245, 135, 0) 95.3%)",
          color: isClicked ? "black" : "white",
          border: isClicked ? "2px solid orangered" : "none"
        }}
        onClick={() => handleResponse("aceptado")} // Envía "aceptado" a la API
        disabled={isClicked} // Desactiva el botón si ya se hizo clic
      >
        Aceptar
      </button>

      {/* Botón para rechazar la solicitud */}
      <button
        style={{
          background: isClicked ? "transparent" : "linear-gradient(107deg, rgb(255, 67, 5) 11.1%, rgb(245, 135, 0) 95.3%)",
          color: isClicked ? "black" : "white",
          border: isClicked ? "2px solid orangered" : "none"
        }}
        onClick={() => handleResponse("rechazado")} // Envía "rechazado" a la API
        disabled={isClicked} // Desactiva el botón si ya se hizo clic
      >
        Rechazar
      </button>
      
      {isClicked && <p>{status}</p>} {/* Mensaje que muestra el resultado */}
    </div>
  )
}

export default FollowingUList;
