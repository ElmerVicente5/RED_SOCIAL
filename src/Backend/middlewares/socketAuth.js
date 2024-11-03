import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

// Middleware para verificar el token en WebSocket
export const socketAuth = (socket, next) => {
    // Intentar obtener el token del encabezado o del auth en el handshake
    const token = socket.handshake.auth.token || socket.handshake.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return next(new Error('Token no proporcionado'));
    }

    jwt.verify(token, config.jwtSecret, (err, decoded) => {
        if (err) {
            return next(new Error('Token inválido'));
        }

        // Almacenar el id y rol del usuario en el objeto socket
        socket.userId = decoded.id;
        socket.role = decoded.role;
        next();
    });
};
