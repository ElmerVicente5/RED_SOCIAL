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

const obtenerUsuarios = async () => {
  const usuarios = await db('users')
      .select('user_id', 'nombre'); // Seleccionar solo el ID y nombre de los usuarios
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
