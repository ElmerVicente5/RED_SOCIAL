import { authService } from '../services/auth.service.js';
import { body, validationResult } from 'express-validator';


// api/usuario/login
const loginUsuario = async (req, res) => {
    await body('email').notEmpty().isEmail().run(req);
    await body('password').notEmpty().isString().run(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const token = await authService.login(email, password);

        return res.status(200).json({
            message: "Usuario encontrado",
            token // Devolver el token al usuario
        });
    } catch (error) {
        console.log(error);
        res.status(401).json({ error: error.message });
    }
};

// api/producto/registrar
// /api/producto/registrar
const registrarUsuario = async (req, res) => {
    // Validación de los campos
    await body('nombre').notEmpty().isString().run(req);
    await body('email').notEmpty().isEmail().run(req);
    await body('password').notEmpty().isString().run(req);
    await body('ciudad').optional().isString().run(req); // Campo opcional
    await body('fechaNacimiento').optional().isDate().run(req); // Campo opcional
    await body('fotoPerfil').optional().isString().run(req); // Campo opcional para la URL de la foto

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Obtén los datos del cuerpo de la solicitud
        const { nombre, email, password, ciudad, fechaNacimiento, fotoPerfil } = req.body;

        // Llamada a la capa de servicio para registrar el usuario
        const usuario = await authService.registrarUsuario(nombre, email, password, ciudad, fechaNacimiento, fotoPerfil);
        
        return res.status(201).json({ message: "Usuario registrado con éxito", usuario });
    } catch (error) {
        if (error.statusCode === 409 || error.message === "El usuario ya está registrado") {
            return res.status(409).json({ message: "El usuario ya está registrado" });
        }

        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
};

// api/producto/dashboard
const verDashboard = (req, res) => {
    res.status(200).json({ message: 'Se puede acceder al dashboard' });
};

// api/producto/perfil
const verPerfil = async (req, res) => {
    const userId = req.userId; 
    //console.log(userId);

    try {
        const usuario = await authService.obtenerUsuarioPorId(userId); 
        if (!usuario) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }
        //console.log(usuario);
        return res.status(200).json(usuario);
    } catch (error) {
        console.log(error);
        return res.status(403).json({ message: "Error al obtener el perfil", error });
    }
};

// api/usuario/actualizar
// api/usuario/actualizar
const actualizarPerfil = async (req, res) => {
    const userId = req.userId;

    // Validaciones de campos
    await body('nombre').optional().isString().run(req);
    await body('email').optional().isEmail().run(req);
    await body('ciudad').optional().isString().run(req);
    await body('fechaNacimiento').optional().isDate().run(req);
    await body('fotoPerfil').optional().isString().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nombre, email, ciudad, fechaNacimiento, fotoPerfil } = req.body;
        const usuarioActualizado = await authService.actualizarUsuario(userId, { nombre, email, ciudad, fechaNacimiento, fotoPerfil });

        return res.status(200).json({ message: "Perfil actualizado con éxito", usuarioActualizado });
    } catch (error) {
        console.error("Error al actualizar el perfil:", error);
        res.status(500).json({ message: "Error al actualizar el perfil" });
    }
};

// api/usuario/cambiar-contrasena
const cambiarContrasena = async (req, res) => {
    const userId = req.userId;

    // Validaciones de campos
    await body('passwordActual').notEmpty().isString().run(req);
    await body('nuevaPassword').notEmpty().isString().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { passwordActual, nuevaPassword } = req.body;

        // Llama al método del servicio para manejar el cambio de contraseña completo
        const resultado = await authService.cambiarContrasena(userId, passwordActual, nuevaPassword);

        return res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);
        res.status(500).json({ message: "Error al cambiar la contraseña" });
    }
};

// api/usuario/obtener-usuarios
const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await authService.obtenerUsuarios();
        return res.status(200).json({ usuarios });
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const UsuarioController = {
    loginUsuario,
    registrarUsuario,
    verDashboard,
    verPerfil,
    actualizarPerfil,
    cambiarContrasena,
    obtenerUsuarios
};
