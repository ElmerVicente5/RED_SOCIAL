import { Router } from 'express';
import { postController } from '../controllers/post.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js'; // Asegúrate de crear este middleware
import multer from 'multer';
const router = Router();


// Configuración de multer para la carga de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

router.post('/newPost', verificarToken, upload.single('contenido_url'), postController.crearPublicacion);


router.get('/listarPost',verificarToken,postController.listarPublicaciones);
router.get('/postUser',verificarToken,postController.listarPublicacionesPorUsuario);
router.get('/listarPostFriends',verificarToken,postController.listarPublicacionesPorUsuarioYAmigos);
router.post('/darMegusta',verificarToken,postController.darMeGusta);
router.post('/comentar',verificarToken,postController.agregarComentario);
router.post('/obtener-comentarios',verificarToken, postController.obtenerComentariosPorPost);

export default router;

