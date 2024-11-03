// src/controllers/chatController.js
import { ChatModel } from '../models/chat.model.js';


const chatController = {
  async iniciarChat(req, res) {
    const { user1Id, user2Id } = req.body;
    try {
      const chat = await ChatModel.Chat.findOrCreateChat(user1Id, user2Id);
      res.json(chat);
    } catch (error) {
      console.error('Error al iniciar el chat:', error);
      res.status(500).json({ error: 'Error al iniciar el chat' });
    }
  },

  async obtenerChats(req, res) {
    const { userId } = req.params;
    try {
      const chats = await ChatModel.Chat.getChatsForUser(userId);
      res.json(chats);
    } catch (error) {
      console.error('Error al obtener chats:', error);
      res.status(500).json({ error: 'Error al obtener chats' });
    }
  },

  async obtenerMensajes(req, res) {
    const { chatId } = req.params;
    try {
      const messages = await ChatModel.Message.getMessagesForChat(chatId);
      res.json(messages);
    } catch (error) {
      console.error('Error al obtener mensajes:', error);
      res.status(500).json({ error: 'Error al obtener mensajes' });
    }
  }
};

export default chatController;
