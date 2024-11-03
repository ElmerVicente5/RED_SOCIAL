import { Router } from 'express';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js'; 
import chatController from '../controllers/chat.controller.js';
const router = Router();

// Iniciar un nuevo chat
router.post('/iniciar', chatController.iniciarChat);

// Obtener todos los chats de un usuario
router.get('/usuario/:userId', chatController.obtenerChats);

// Obtener todos los mensajes de un chat
router.get('/:chatId/mensajes', chatController.obtenerMensajes);

export default router;