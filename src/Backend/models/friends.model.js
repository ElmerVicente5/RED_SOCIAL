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
    //console.log(userId);
    return await db('friends')
      .distinct(
        db.raw(`CASE 
                  WHEN friends.user_id = ? THEN friends.friend_user_id 
                  ELSE friends.user_id 
                END AS amigo_id`, [userId]),
        db.raw(`CASE 
                  WHEN friends.user_id = ? THEN (SELECT nombre FROM users WHERE users.user_id = friends.friend_user_id) 
                  ELSE (SELECT nombre FROM users WHERE users.user_id = friends.user_id) 
                END AS nombre`, [userId]),
        'friends.estado',
        db.raw(`CASE 
                  WHEN friends.user_id = ? THEN (SELECT foto_perfil FROM users WHERE users.user_id = friends.friend_user_id) 
                  ELSE (SELECT foto_perfil FROM users WHERE users.user_id = friends.user_id) 
                END AS foto_perfil`, [userId])
      )
      .where(function() {
        this.where('friends.user_id', userId).orWhere('friends.friend_user_id', userId);
      })
      .andWhere('friends.estado', 'aceptado');
  }

    // Listar solicitudes de amistad pendientes
    static async listarSolicitudesPendientes(userId) {
    return await db('friends')
      .join('users', 'friends.user_id', 'users.user_id') // Unimos con la tabla de usuarios
      .select('users.nombre','users.foto_perfil', 'friends.estado', 'friends.friend_user_id','friends.friend_id') // Seleccionamos el nombre del usuario que envió la solicitud
      .where('friends.friend_user_id', userId) // Filtramos por el usuario que recibió la solicitud
      .andWhere('friends.estado', 'pendiente'); // Solo las solicitudes pendientes
    }
  }
  
  export default FriendModel;
