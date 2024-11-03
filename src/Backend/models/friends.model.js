import { db } from '../database/conexion.database.js';

class FriendModel {
    // Enviar solicitud de amistad
    static async enviarSolicitud(userId, friendUserId) {
      const estado = 'pendiente'; // Estado de la solicitud
      return await db('friends').insert({
        user_id: userId,
        friend_user_id: friendUserId,
        estado,
      });
    }
  
    // Aceptar solicitud de amistad
    static async aceptarSolicitud(solicitudId, estado) {
      return await db('friends')
        .where({ friend_id: solicitudId})
        .update({ estado: estado});
    }
  
    
  
    // Listar amigos
    static async listarAmigos(userId) {
      return await db('friends')
        .join('users', 'friends.friend_user_id', 'users.user_id')
        .select('friends.friend_user_id','users.nombre', 'friends.estado')
        .where('friends.user_id', userId)
        .andWhere('friends.estado', 'aceptado');
    }
    // Listar solicitudes de amistad pendientes
    static async listarSolicitudesPendientes(userId) {
    return await db('friends')
      .join('users', 'friends.user_id', 'users.user_id') // Unimos con la tabla de usuarios
      .select('users.nombre', 'friends.estado', 'friends.friend_user_id') // Seleccionamos el nombre del usuario que envió la solicitud
      .where('friends.friend_user_id', userId) // Filtramos por el usuario que recibió la solicitud
      .andWhere('friends.estado', 'pendiente'); // Solo las solicitudes pendientes
    }
  }
  
  export default FriendModel;
