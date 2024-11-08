import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import http from 'http';  
import { Server } from 'socket.io'; 

import './config/passport-setup.js';
import usuarioRouter from './routes/usuario.route.js';
import postRouter from './routes/posts.route.js';
import FriendRouter from './routes/friends.route.js';
import chatRouter from './routes/chat.route.js';
import socketService from './services/socket.service.js'; 
import path from 'path';
import { fileURLToPath } from 'url';

//const IP_ADDRESS = '20.3.250.158';
const IP_ADDRESS = 'localhost';

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: `http://${IP_ADDRESS}:3000`,
        methods: ['GET', 'POST'],
        credentials: true
    }
}); 

app.use(cors({
    origin: `http://${IP_ADDRESS}:3000`, // Cambia esto si es necesario
    methods: ['GET', 'POST'],
    credentials: true
}));

// Obtiene el directorio actual del archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Usar __dirname en tu ruta
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'f9f8a7f6e5d4c3b2a1s0d9s8h7g6f5e4d3c2b1a', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/usuario', usuarioRouter);
app.use('/api/post', postRouter);
app.use('/api/amigos', FriendRouter);
app.use('/api/chat', chatRouter);

socketService(io);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
    console.log(`El servidor de la API y WebSocket se está ejecutando en el puerto: ${PORT}`);
});
