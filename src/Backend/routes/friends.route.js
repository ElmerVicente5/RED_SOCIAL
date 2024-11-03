import { Router } from 'express';
import FriendController from '../controllers/friend.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js'; // Asegúrate de crear este middleware
const router = Router();


router.post('/solicitar',verificarToken,FriendController.enviarSolicitud);
router.get('/solicitudes',verificarToken,FriendController.obtenerSolicitudesPendientes);
router.post('/estadoSolicitud',verificarToken,FriendController.aceptarSolicitud);
router.get('/listarAmigos',verificarToken,FriendController.listarAmigos);


export default router;