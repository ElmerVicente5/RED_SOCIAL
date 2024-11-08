import { db } from '../database/conexion.database.js';

// Método para registrar un nuevo usuario
const crearUsuario = async (nombre, email, password, ciudad, fechaNacimiento, fotoPerfil, role = 'usuario') => {
  const [user] = await db('users')
    .insert({ nombre, email, password, ciudad, fecha_nacimiento: fechaNacimiento, foto_perfil: fotoPerfil, role })
    .returning('*'); // retorna el usuario insertado
  return user;
};

// Método para buscar un usuario por email
const buscarPorEmail = async (email) => {
  const user = await db('users')
    .where({ email })
    .first(); // retorna solo un registro
  return user;
};

// Método para iniciar sesión (mismo método que buscarPorEmail)
const login = async (email) => {
  const user = await db('users')
    .where({ email })
    .first();
  return user;
};

// Método para buscar un usuario por ID
const buscarPorId = async (id) => {
  const user = await db('users')
    .where({ user_id: id }) // Cambiado a user_id
    .first();
  return user;
};

// Método para actualizar un usuario
const actualizarUsuario = async (userId, datosActualizados) => {
  const [usuarioActualizado] = await db('users')
    .where({ user_id: userId }) // Cambiado a user_id
    .update(datosActualizados) // Actualiza los datos del usuario
    .returning('*'); // Retorna el usuario actualizado
  return usuarioActualizado;
};

// Método para actualizar la contraseña de un usuario
const actualizarPassword = async (userId, nuevaPassword) => {
  const [usuarioActualizado] = await db('users')
    .where({ user_id: userId }) // Cambiado a user_id
    .update({ password: nuevaPassword }) // Actualiza solo la contraseña
    .returning('*'); // Retorna el usuario actualizado
  return usuarioActualizado;
};

const obtenerUsuarios = async (userId) => {
  const usuarios = await db('users')
    .select(
      'users.user_id',
      'users.foto_perfil',
      'users.nombre',
      'friends.estado as estado_solicitud'
    )
    .leftJoin('friends', function() {
      this.on(function() {
        this.on('friends.friend_user_id', '=', 'users.user_id')
          .andOn('friends.user_id', '=', db.raw('?', [userId]));
      })
      .orOn(function() {
        this.on('friends.user_id', '=', 'users.user_id')
          .andOn('friends.friend_user_id', '=', db.raw('?', [userId]));
      });
    })
    .whereNot('users.user_id', userId) // Excluir al usuario actual
    .where(function() {
      this.whereNull('friends.estado') // No hay relación de amistad
        .orWhere('friends.estado', 'pendiente'); // O tiene solicitud pendiente
    })
    .whereNotIn('users.user_id', function() { // Subconsulta para excluir amigos confirmados
      this.select(db.raw(`CASE 
                            WHEN friends.user_id = ? THEN friends.friend_user_id 
                            ELSE friends.user_id 
                          END`, [userId]))
        .from('friends')
        .where(function() {
          this.where('friends.user_id', userId)
            .orWhere('friends.friend_user_id', userId);
        })
        .andWhere('friends.estado', 'aceptado'); // Excluir amigos aceptados
    });

  return usuarios;
};

// Exportar el modelo
export const UsuarioModel = {
  crearUsuario,
  buscarPorEmail,
  login,
  buscarPorId,
  actualizarUsuario,
  actualizarPassword,
  obtenerUsuarios
};
