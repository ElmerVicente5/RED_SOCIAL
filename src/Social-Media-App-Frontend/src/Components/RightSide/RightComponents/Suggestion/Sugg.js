import React, { useEffect, useState } from 'react';
import Simg1 from "../../../../assets/Suggestion/avatar1.png";  // Imagen predeterminada
import "../Suggestion/Sugg.css";
import axios from 'axios';

const Sugg = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/usuario/usuarios', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuarios(response.data.usuarios);
      } catch (err) {
        console.error("Error al obtener los usuarios:", err);
        setError("No se pudieron cargar los usuarios.");
      }
    };

    fetchUsuarios();
  }, []);

  const enviarSolicitud = async (friendUserId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/amigos/solicitar',
        { friendUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMensaje(`Solicitud enviada a usuario ${friendUserId}`);
      setUsuarios(prevUsuarios =>
        prevUsuarios.map(usuario =>
          usuario.user_id === friendUserId
            ? { ...usuario, estado_solicitud: 'pendiente' }
            : usuario
        )
      );
    } catch (err) {
      console.error("Error al enviar la solicitud:", err);
      setMensaje("No se pudo enviar la solicitud.");
    }
  };

  return (
    <div className="Sugg-comp">
      <h2>Sugerencias para ti</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {mensaje && <p style={{ color: 'green' }}>{mensaje}</p>}

      {usuarios.length > 0 ? (
        usuarios.map((usuario) => {
          // Construir la URL completa de la imagen
          const fotoPerfil = usuario.foto_perfil
            ? `http://localhost:8000/${usuario.foto_perfil}`  // Aquí aseguramos que la ruta sea válida
            : Simg1;  // Imagen predeterminada si no hay foto_perfil

          return (
            <div className="sugg-people" key={usuario.user_id}>
              <div className="s-left">
                <img src={fotoPerfil} alt={`${usuario.nombre} perfil`} />
                <h3>{usuario.nombre}</h3>
              </div>
              <div className="s-right">
                {usuario.estado_solicitud === null ? (
                  <button onClick={() => enviarSolicitud(usuario.user_id)}>Enviar Solicitud</button>
                ) : (
                  <button disabled>Solicitud de amistad enviada</button>
                )}
              </div>
            </div>
          );
        })
      ) : (
        !error && <p>Cargando sugerencias...</p>
      )}
    </div>
  );
};

export default Sugg;
