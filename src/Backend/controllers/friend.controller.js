import FriendModel  from '../models/friends.model.js';
class FriendController {
    // Enviar solicitud de amistad
    static async enviarSolicitud(req, res) {
      const { friendUserId } = req.body; // Obtener el ID del usuario amigo desde el cuerpo de la solicitud
      const userId = req.userId; // Asumiendo que el userId está en el request
  
      try {
        await FriendModel.enviarSolicitud(userId, friendUserId);
        res.status(201).json({ message: 'Solicitud de amistad enviada.' });
      } catch (error) {
        res.status(500).json({ message: 'Error al enviar la solicitud de amistad.', error: error.message });
      }
    }
  
    // Aceptar solicitud de amistad
 // Aceptar solicitud de amistad por ID de solicitud
    static async aceptarSolicitud(req, res) {
        const { solicitudId,estado } = req.body; // Obtener el ID de la solicitud desde los parámetros de la ruta
        //const userId = req.userId; // Asumiendo que el userId está en el request

        try {
        await FriendModel.aceptarSolicitud(solicitudId,estado);
        res.status(200).json({ message: `Solicitud de amistad ${estado}.`});
        } catch (error) {
        res.status(500).json({ message: 'Error al aceptar la solicitud de amistad.', error: error.message });
        }
    }
  
  
    // Listar amigos
    static async listarAmigos(req, res) {
      const userId = req.userId; // Asumiendo que el userId está en el request
  
      try {
        const amigos = await FriendModel.listarAmigos(userId);
        res.status(200).json({ amigos });
      } catch (error) {
        res.status(500).json({ message: 'Error al listar amigos.', error: error.message });
      }
    }

    // Listar solicitudes de amistad pendientes
  static async obtenerSolicitudesPendientes(req, res) {
    const userId = req.userId; // Asumiendo que el userId está en el request

    try {
      const solicitudes = await FriendModel.listarSolicitudesPendientes(userId);
      res.status(200).json(solicitudes);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener solicitudes de amistad.', error: error.message });
    }
  }

  }
  
  export default FriendController;