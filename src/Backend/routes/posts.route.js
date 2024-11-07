import { Router } from 'express';
import { postController } from '../controllers/post.controller.js';
import { verificarToken, verificarAdmin } from '../middlewares/auth.js'; // Asegúrate de crear este middleware
const router = Router();


router.post('/newPost',verificarToken, postController.crearPublicacion);
router.get('/listarPost',verificarToken,postController.listarPublicaciones);
router.get('/postUser',verificarToken,postController.listarPublicacionesPorUsuario);
router.get('/listarPostFriends',verificarToken,postController.listarPublicacionesPorUsuarioYAmigos);
router.post('/darMegusta',verificarToken,postController.darMeGusta);
router.post('/comentar',verificarToken,postController.agregarComentario);
router.post('/obtener-comentarios',verificarToken, postController.obtenerComentariosPorPost);

export default router;

