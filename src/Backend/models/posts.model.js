// posts.model.js
import { db } from '../database/conexion.database.js';

// Función para insertar una nueva publicación
const crearPublicacion = async (user_id, contenido_texto, contenido_url) => {
  const [post] = await db('posts')  
    .insert({
      user_id,
      contenido_texto,
      contenido_url,
    })
    .returning('*'); // Retorna la publicación insertada
  return post;
};

// Función para listar todas las publicaciones
const listarPublicaciones = async () => {
  const publicaciones = await db('posts')
    .join('users', 'posts.user_id', '=', 'users.user_id')
    .leftJoin('reactions', function() {
      this.on('posts.post_id', '=', 'reactions.post_id')
        .andOn('reactions.tipo', '=', db.raw('?', ['me gusta'])); // Solo contar "me gusta"
    })
    .leftJoin('comments', 'posts.post_id', '=', 'comments.post_id') // Para contar los comentarios
    .select(
      'posts.post_id',
      'users.nombre as autor',
      'posts.contenido_texto',
      'posts.contenido_url',
      'posts.fecha_creacion',
      db.raw('COUNT(DISTINCT reactions.reaction_id) as num_me_gusta'), // Conteo de reacciones "me gusta"
      db.raw('COUNT(DISTINCT comments.comment_id) as num_comentarios') // Conteo de comentarios
    )
    .groupBy('posts.post_id', 'users.nombre', 'posts.contenido_texto', 'posts.contenido_url', 'posts.fecha_creacion')
    .orderBy('posts.fecha_creacion', 'desc'); // Ordenar por fecha de creación
  
  return publicaciones;
};
// Función para agregar un comentario a una publicación
const agregarComentario = async (post_id, user_id, contenido) => {
  const [comentario] = await db('comments')
    .insert({
      post_id,
      user_id,
      contenido,
    })
    .returning('*'); // Retorna el comentario insertado
  return comentario;
};

// Función para listar todos los comentarios de un post
const listarComentariosPorPost = async (post_id) => {
  try {
    const comentarios = await db('comments')
      .join('users', 'comments.user_id', '=', 'users.user_id')
      .select(
        'comments.comment_id',
        'users.nombre as usuario',
        'comments.contenido',
        'comments.fecha_creacion'
      )
      .where('comments.post_id', post_id)
      .orderBy('comments.fecha_creacion', 'asc'); // Ordenar por fecha de creación
    return comentarios;
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener los comentarios de la publicación');
  }
};

// Función para darle "me gusta" a una publicación
// Función para alternar "me gusta" en una publicación
const darMeGusta = async (post_id, user_id) => {
  // Verificar si el usuario ya dio "me gusta" a la publicación
  const existeReaccion = await db('reactions')
    .where({ post_id, user_id, tipo: 'me gusta' })
    .first();

  if (existeReaccion) {
    // Si ya existe, elimina el "me gusta"
    await db('reactions')
      .where({ reaction_id: existeReaccion.reaction_id })
      .del();
    return { message: 'Me gusta eliminado exitosamente' };
  } else {
    // Si no existe, añade un "me gusta"
    const [reaccion] = await db('reactions')
      .insert({
        post_id,
        user_id,
        tipo: 'me gusta',
      })
      .returning('*'); // Retorna la reacción insertada
    return { message: 'Me gusta añadido exitosamente', reaccion };
  }
};


// Función para listar las publicaciones de un usuario específico
const listarPublicacionesPorUsuario = async (user_id) => {
  try {
    const publicaciones = await db('posts')
      .leftJoin('reactions', function() {
        this.on('posts.post_id', '=', 'reactions.post_id')
          .andOn('reactions.tipo', '=', db.raw('?', ['me gusta'])); // Solo contar "me gusta"
      })
      .leftJoin('comments', 'posts.post_id', '=', 'comments.post_id') // Para contar los comentarios
      .select(
        'posts.post_id',
        'posts.contenido_texto',
        'posts.contenido_url',
        'posts.fecha_creacion',
        db.raw('COUNT(DISTINCT reactions.reaction_id) as num_me_gusta'), // Conteo de reacciones "me gusta"
        db.raw('COUNT(DISTINCT comments.comment_id) as num_comentarios') // Conteo de comentarios
      )
      .where('posts.user_id', user_id)
      .groupBy('posts.post_id', 'posts.contenido_texto', 'posts.contenido_url', 'posts.fecha_creacion')
      .orderBy('posts.fecha_creacion', 'desc'); // Ordenar por fecha de creación
    
    return publicaciones;
  } catch (error) {
    throw new Error('Error al obtener las publicaciones del usuario');
  }
};

const listarPublicacionesDeUsuarioYAmigos = async (user_id) => {
  try {
    const publicaciones = await db('posts')
      .join('users', 'posts.user_id', '=', 'users.user_id')
      .leftJoin('friends', function() {
        this.on('friends.user_id', '=', user_id)
          .orOn('friends.friend_user_id', '=', user_id)
          .andOn(function() {
            this.on('friends.user_id', '=', 'posts.user_id')
              .orOn('friends.friend_user_id', '=', 'posts.user_id');
          });
      })
      .leftJoin('reactions', function() {
        this.on('posts.post_id', '=', 'reactions.post_id')
          .andOn('reactions.tipo', '=', db.raw('?', ['me gusta']));
      })
      .leftJoin('comments', 'posts.post_id', '=', 'comments.post_id')
      .where(function() {
        this.where('posts.user_id', user_id)
          .orWhere('friends.user_id', user_id)
          .orWhere('friends.friend_user_id', user_id);
      })
      .select(
        'posts.post_id',
        'users.nombre as autor',
        'posts.contenido_texto',
        'posts.contenido_url',
        'posts.fecha_creacion',
        db.raw('COUNT(DISTINCT reactions.reaction_id) as num_me_gusta'),
        db.raw('COUNT(DISTINCT comments.comment_id) as num_comentarios'),
        // Subconsulta para verificar si el usuario ya dio "me gusta" a esta publicación
        db.raw(`EXISTS (
          SELECT 1 FROM reactions AS r 
          WHERE r.post_id = posts.post_id 
          AND r.user_id = ? 
          AND r.tipo = 'me gusta'
        ) as has_liked`, [user_id])  // Indicador de "me gusta"
      )
      .groupBy(
        'posts.post_id',
        'users.nombre',
        'posts.contenido_texto',
        'posts.contenido_url',
        'posts.fecha_creacion'
      )
      .orderBy('posts.fecha_creacion', 'desc');
    
    return publicaciones;
  } catch (error) {
    throw new Error('Error al obtener las publicaciones del usuario y sus amigos');
  }
};

// Exportar el modelo
export const PostModel = {
  crearPublicacion,
  listarPublicaciones,
  agregarComentario,
  darMeGusta,
  listarPublicacionesPorUsuario,
  listarPublicacionesDeUsuarioYAmigos,
  listarComentariosPorPost
};
