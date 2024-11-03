// src/controllers/chatController.js
import { ChatModel} from '../models/chat.model.js';
import { socketAuth } from '../middlewares/socketAuth.js';

export default function socketService(io) {
    // Aplica el middleware de autenticación para Socket.IO
    io.use(socketAuth);

    io.on('connection', (socket) => {
        console.log(`Usuario conectado: ${socket.userId}, Rol: ${socket.role}`);

        // Función para cargar mensajes al iniciar un chat
        const loadMessages = async (chatId) => {
            try {
                const mensajes = await ChatModel.Message.getMessagesForChat(chatId);
                socket.emit('cargar_mensajes', mensajes);
                console.log(`Mensajes cargados para el chat ${chatId} : ${mensajes}`);
            } catch (error) {
                console.error('Error al cargar mensajes:', error);
            }
        };

        // Evento para iniciar un chat
        socket.on('iniciar_chat', async ({ friendUserId }) => {
            try {
                const chat = await ChatModel.Chat.findOrCreateChat(socket.userId, friendUserId);
                socket.join(`chat_${chat.chat_id}`);
                io.to(`chat_${chat.chat_id}`).emit('chat_iniciado', chat.chat_id);
                await loadMessages(chat.chat_id); // Cargar mensajes después de iniciar el chat
            } catch (error) {
                console.error('Error al iniciar el chat:', error);
            }
        });

        // Evento para enviar un mensaje
        socket.on('enviar_mensaje', async ({ chatId, contenido }) => {
            try {
                const mensaje = await ChatModel.Message.createMessage(chatId, socket.userId, contenido);
                io.to(`chat_${chatId}`).emit('nuevo_mensaje', mensaje);
            } catch (error) {
                console.error('Error al enviar el mensaje:', error);
            }
        });

        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.userId}`);
        });
    });
}


