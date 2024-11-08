import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js'; // Asegúrate de crear este middleware
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { config } from '../config/config.js';
import multer from 'multer';
const router = Router();

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Ruta para cargar imagen de perfil
router.post('/cargar-imagen', verificarToken, upload.single('imagen'), UsuarioController.cargarImagen);



// Ruta para registrar un usuario (sin autenticación)
router.post('/registrar', UsuarioController.registrarUsuario); // Cambiado a registrarUsuario

// Ruta para iniciar sesión
router.post('/login', UsuarioController.loginUsuario);

// Ruta para autenticar con Google
router.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Ruta de callback de Google
router.get('/auth/google/callback', passport.authenticate('google', { session: true }), (req, res) => { // Cambia session a true
    // Generar JWT con el id y el rol del usuario
    
    const token = jwt.sign(
        { id: req.user.id, role: req.user.role }, 
        config.jwtSecret,
        { expiresIn: '1h' } 
    );

    // Redirigir al frontend con el token
    res.redirect(`http://localhost:3000/?token=${token}`); 
});

router.get('/perfil', verificarToken, UsuarioController.verPerfil); // Ruta protegida
router.post('/actualizar', verificarToken, UsuarioController.actualizarPerfil); // Ruta protegida
router.post('/actualizar-password', verificarToken, UsuarioController.cambiarContrasena); // Ruta protegida
router.get('/usuarios', verificarToken,  UsuarioController.obtenerUsuarios); // Ruta protegida
export default router;
