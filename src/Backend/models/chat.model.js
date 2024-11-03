import { db } from '../database/conexion.database.js';

const Chat = {
    async findOrCreateChat(user1Id, user2Id) {
      let chat = await db('chats')
        .where({ user1_id: user1Id, user2_id: user2Id })
        .orWhere({ user1_id: user2Id, user2_id: user1Id })
        .first();
      console.log("chat", chat);
      if (!chat) {
        const result = await db('chats').insert({ user1_id: user1Id, user2_id: user2Id });
        const chatId = result.id; // Ajusta esto según la estructura del objeto devuelto
        chat = { chat_id: chatId, user1_id: user1Id, user2_id: user2Id };
      }
      return chat;
    },
  
    async getChatsForUser(userId) {
      return db('chats').where('user1_id', userId).orWhere('user2_id', userId);
    }
  };

  
  const Message = {
    async createMessage(chatId, senderId, contenido) {
        // Inserta el nuevo mensaje en la base de datos
        const result = await db('messages').insert({
            chat_id: chatId,
            sender_id: senderId,
            contenido,
            fecha_envio: db.fn.now()
        }).returning('*'); // Aquí pedimos que retorne toda la fila insertada

        // El resultado es un diccionario que representa el mensaje creado
        const message = result[0]; // Si el resultado es un objeto, accedemos al primer elemento

        // Devuelve el mensaje creado
        return message; // Aquí devuelves directamente el objeto que contiene el mensaje
    },

    async getMessagesForChat(chatId) {
        return db('messages').where({ chat_id: chatId }).orderBy('fecha_envio', 'asc');
    }
};
  
  export const ChatModel = {
    Chat,
    Message
  }