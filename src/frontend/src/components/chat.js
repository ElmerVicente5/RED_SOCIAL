import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

// Obteniendo el token desde localStorage o usando un token predeterminado
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzdWFyaW8iLCJlbWFpbCI6InZpY2VudGUucGVsaWNvQGdtYWlsLmNvbSIsImlhdCI6MTczMDY2OTk5NCwiZXhwIjoxNzMwNjczNTk0fQ.yuFYGTvW2SCi76009vZGKf5LgmeDFfSVL3P2cWrC7SY"; 
//const token = localStorage.getItem('token') || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6InVzdWFyaW8iLCJlbWFpbCI6InZpY2VudGUucGVsaWNvQGdtYWlsLmNvbSIsImlhdCI6MTczMDY2OTk5NCwiZXhwIjoxNzMwNjczNTk0fQ.yuFYGTvW2SCi76009vZGKf5LgmeDFfSVL3P2cWrC7SY"; 
const socket = io('http://localhost:8000', {
    auth: { token },
});

const Chat = () => {
    const [chatId, setChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);

    useEffect(() => {
        socket.on('cargar_mensajes', (mensajes) => {
            setMessages(mensajes);
            setLoadingMessages(false);
        });

        socket.on('nuevo_mensaje', (mensaje) => {
            setMessages((prevMessages) => [...prevMessages, mensaje]);
        });

        socket.on('chat_iniciado', (chatId) => {
            setChatId(chatId);
            setChatStarted(true);
        });

        socket.on('connect_error', (err) => {
            console.error('Error de conexión:', err);
        });

        return () => {
            socket.off('cargar_mensajes');
            socket.off('nuevo_mensaje');
            socket.off('chat_iniciado');
            socket.off('connect_error');
        };
    }, []);

    const iniciarChat = (friendUserId) => {
        setLoadingMessages(true);
        socket.emit('iniciar_chat', { friendUserId });
    };

    const enviarMensaje = () => {
        if (newMessage.trim() !== '' && chatId) {
            socket.emit('enviar_mensaje', { chatId, contenido: newMessage });
            setNewMessage('');
        }
    };

    return (
        <div>
            <h1>Chat</h1>
            <button onClick={() => iniciarChat(2)}>Iniciar chat con usuario 2</button>
            {loadingMessages && <p>Cargando mensajes...</p>}
            {chatStarted && (
                <div>
                    <h2>Mensajes</h2>
                    <ul>
                        {messages.map((msg, index) => (
                            <li key={index}>{msg.contenido}</li>
                        ))}
                    </ul>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Escribe un mensaje..."
                    />
                    <button onClick={enviarMensaje}>Enviar</button>
                </div>
            )}
        </div>
    );
};

export default Chat;
