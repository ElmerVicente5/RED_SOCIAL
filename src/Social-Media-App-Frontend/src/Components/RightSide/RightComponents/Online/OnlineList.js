import React, { useState, useEffect } from 'react';
import { FaRegCommentDots } from 'react-icons/fa';
import { io } from 'socket.io-client';
import { API_URL } from '../../../../config/config';

const OnlineList = ({ value }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [chatId, setChatId] = useState(null);
  const currentUser = "TuNombre"; // 
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    const newSocket = io(`${API_URL}`, {
      auth: { token },
    });

    setSocket(newSocket);

    newSocket.on('cargar_mensajes', (mensajes) => {
      setChatMessages(mensajes);
    });

    newSocket.on('nuevo_mensaje', (mensaje) => {
      setChatMessages((prevMessages) => [...prevMessages, mensaje]);
    });

    return () => newSocket.disconnect();
  }, []);

  const toggleChat = () => {
    setIsChatOpen((prev) => !prev);

    if (!isChatOpen && socket) {
      socket.emit('iniciar_chat', { friendUserId: value.userId });

      socket.once('iniciar_chat', (chatId) => {
        if (chatId) {
          setChatId(chatId);
          socket.emit('cargar_mensajes', chatId);
        }
      });
    }
  };

  const handleSendMessage = () => {
    if (message.trim() && socket && chatId) {
      socket.emit('enviar_mensaje', { chatId, contenido: message });
      setMessage('');
    }
  };

  return (
    <div className="online-people">
      <img src={value.profilepicture} alt="" />
      <p>{value.username}</p>
      
      <button onClick={toggleChat} className="message-button">
        <FaRegCommentDots size={20} />
      </button>

      {isChatOpen && (
        <div className="chat-window">
          <h3>Chat con {value.username}</h3>
          <div className="chat-content">
            {chatMessages.map((msg, index) => {
              const senderInitial = msg.sender ? msg.sender.charAt(0).toUpperCase() : '?';
              const isSent = msg.sender === currentUser;

              return (
                <div key={index} className={`message ${isSent ? 'sent' : 'received'}`}>
                  <div className="message-info">
                    <div className="avatar">
                      {isSent ? 'You' : senderInitial}
                    </div>
                    <span className="sender"></span>
                  </div>
                  <p className="message-text">{msg.contenido}</p>
                </div>
              );
            })}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>

          <button onClick={toggleChat} className="close-chat">Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default OnlineList;
