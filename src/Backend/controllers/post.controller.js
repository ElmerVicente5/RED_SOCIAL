// posts.controller.js
import { PostModel } from '../models/posts.model.js';

// Controlador para crear una nueva publicación
const crearPublicacion = async (req, res) => {
  const user_id = req.userId;
  const { contenido_texto, contenido_url } = req.body;
  console.log("contenido_texto",contenido_texto);
  console.log("contenido_url",contenido_url);

  
  // Verificar si hay una imagen y obtener su ruta
  const imagen = req.file ? req.file.path : null;
  console.log("imagen",imagen);

  try {
    const nuevaPublicacion = await PostModel.crearPublicacion(user_id, contenido_texto, imagen);
    res.status(201).json({
      message: 'Publicación creada exitosamente',
      publicacion: nuevaPublicacion,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear la publicación',
      error: error.message,
    });
  }
};

// Controlador para listar todas las publicaciones
const listarPublicaciones = async (req, res) => {
  try {
    const publicaciones = await PostModel.listarPublicaciones();
    res.status(200).json({
      message: 'Publicaciones obtenidas exitosamente',
      publicaciones,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las publicaciones',
      error: error.message,
    });
  }
};

// Controlador para listar las publicaciones de un usuario específico
const listarPublicacionesPorUsuario = async (req, res) => {
  const user_id  = req.userId;

  try {
    const publicaciones = await PostModel.listarPublicacionesPorUsuario(user_id);
    res.status(200).json({
      message: 'Publicaciones del usuario obtenidas exitosamente',
      publicaciones,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las publicaciones del usuario',
      error: error.message,
    });
  }
};

// Controlador para listar las publicaciones de un usuario específico
const listarPublicacionesPorUsuarioYAmigos = async (req, res) => {
  const user_id  = req.userId;

  try {
    const publicaciones = await PostModel.listarPublicacionesDeUsuarioYAmigos(user_id);
    res.status(200).json({
      message: 'Publicaciones del usuario obtenidas exitosamente',
      publicaciones,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener las publicaciones del usuario',
      error: error.message,
    });
  }
};



// Controlador para agregar un comentario a una publicación
const agregarComentario = async (req, res) => {
  //const { post_id } = req.params;
  const { post_id, contenido } = req.body;
  const user_id  = req.userId;

  try {
    const nuevoComentario = await PostModel.agregarComentario(post_id, user_id, contenido);
    res.status(201).json({
      message: 'Comentario agregado exitosamente',
      comentario: nuevoComentario,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al agregar el comentario',
      error: error.message,
    });
  }
};
// Controlador para obtener todos los comentarios de una publicación
const obtenerComentariosPorPost = async (req, res) => {
  const { post_id } = req.body; // Obtener post_id de los parámetros de la solicitud
console.log("post id:", post_id);
  try {
    const comentarios = await PostModel.listarComentariosPorPost(post_id);
    res.status(200).json({
      message: 'Comentarios obtenidos exitosamente',
      comentarios,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener los comentarios de la publicación',
      error: error.message,
    });
  }
};
// Controlador para dar "me gusta" a una publicación
const darMeGusta = async (req, res) => {
  const  {post_id}  = req.body;
  const user_id = req.userId;

  console.log("id de post ",post_id,user_id);

  try {
    const reaccion = await PostModel.darMeGusta(post_id, user_id);
    res.status(201).json({
      message: 'Me gusta añadido exitosamente',
      reaccion,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message === 'Ya has dado "me gusta" a esta publicación'
        ? error.message
        : 'Error al dar "me gusta" a la publicación',
      error: error.message,
    });
  }
};


export const postController={
  crearPublicacion,
  listarPublicaciones,
  listarPublicacionesPorUsuario,
  darMeGusta,
  agregarComentario,
  listarPublicacionesPorUsuarioYAmigos,
  obtenerComentariosPorPost



}
