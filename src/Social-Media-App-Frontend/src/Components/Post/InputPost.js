import React, { useState } from "react";
import "../Post/InputPost.css";
import Profile from "../../assets/Suggestion/avatar1.png";
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import PlayCircleFilledOutlinedIcon from '@mui/icons-material/PlayCircleFilledOutlined';
import KeyboardVoiceRoundedIcon from '@mui/icons-material/KeyboardVoiceRounded';
import { FaSmile } from "react-icons/fa";
import axios from "axios";  // Necesitarás axios para hacer solicitudes HTTP
import { API_URL } from "../../config/config";

const InputPost = ({ handleSubmit, setBody, body, images, setImages }) => {
  const [loading, setLoading] = useState(false);

  // Manejo de la carga de la imagen y publicación
  const submitPost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('contenido_texto', body);
    
    // Si hay imagen, agregamos la imagen al FormData, si no es null
    if (images) {
      formData.append('contenido_url', images);
    } else {
      formData.append('contenido_url', null);
    }

    try {
      const response = await axios.post(`${API_URL}/api/post/newPost`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Si es necesario, incluye un token de autenticación
        }
      });

      // Aquí puedes manejar la respuesta de la API (por ejemplo, mostrar un mensaje de éxito)
      console.log(response.data);
      setBody(""); // Limpiar el campo de texto
      setImages(null); // Limpiar la imagen
    } catch (error) {
      console.error("Error al crear la publicación", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="i-form">
      <form onSubmit={submitPost}>
        <div className="i-input-box">
          <img src={Profile} className="i-img" />

          <input
            type="text"
            id="i-input"
            placeholder="What's on your mind?"
            required
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <div className="file-upload">
          <div className="file-icons">
            <label htmlFor="file" className="pv-upload">
              <PhotoLibraryIcon className="input-svg" style={{ fontSize: "38px", color: "orangered" }} />
              <span className="photo-dis">Photo</span>
            </label>

            <div className="pv-upload">
              <PlayCircleFilledOutlinedIcon className="input-svg" style={{ fontSize: "38px", color: "black" }} />
              <span className="photo-dis">Video</span>
            </div>

            <div className="pv-upload">
              <KeyboardVoiceRoundedIcon className="input-svg" style={{ fontSize: "38px", color: "green" }} />
              <span className="photo-dis">Audio</span>
            </div>

            <div className="pv-upload">
              <FaSmile className="input-svg" style={{ fontSize: "30px", color: "red" }} />
              <span className="photo-dis">Feelings/Activity</span>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Subiendo..." : "Compartir"}
          </button>
        </div>

        <div style={{ display: "none" }}>
          <input
            type="file"
            id="file"
            accept=".png,.jpeg,.jpg"
            onChange={(e) => setImages(e.target.files[0])}
          />
        </div>

        {images && (
          <div className="displayImg">
            <CloseRoundedIcon onClick={() => setImages(null)} />
            <img src={URL.createObjectURL(images)} alt="Imagen previa" />
          </div>
        )}
      </form>
    </div>
  );
};

export default InputPost;
