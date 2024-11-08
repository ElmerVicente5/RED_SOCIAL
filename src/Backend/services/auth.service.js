import { UsuarioModel } from '../models/usuario.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { config } from '../config/config.js'; // Importar la configuración


class AuthService {
    // Método para autenticar un usuario
    async login(email, password) {
        const usuario = await UsuarioModel.buscarPorEmail(email); // Cambiado a buscarPorEmail
        
        if (!usuario) {
            throw new Error("Usuario o contraseña no válidos");
        }

        // Comprobar la contraseña usando bcrypt
        const contrasenaValida = await bcrypt.compare(password, usuario.password);
        if (!contrasenaValida) {
            throw new Error("Usuario o contraseña no válidos");
        }

        // Generar el token JWT
        const token = jwt.sign(
            { id: usuario.user_id, role: usuario.role ,email: usuario.email}, // definir el rol del usuario
            config.jwtSecret,
            { expiresIn: '1h' } 
        );

        return  token ;
    }

    // Método para registrar un usuario
    async registrarUsuario(nombre,email,password,ciudad,fechaNacimiento,fotoPerfil) { // Agregado rol con valor por defecto
        // Verificar si el usuario ya existe
        const usuarioExistente = await UsuarioModel.buscarPorEmail(email);
        console.log("Usuario Existente",usuarioExistente);
        if (usuarioExistente) { // Ya que será undefined si no existe
            const error = new Error("El usuario ya está registrado");
            error.statusCode = 409; // Código HTTP 409: Conflicto
            throw error;
        }

        // Hashear la contraseña
        const contrasenaHasheada = await bcrypt.hash(password, 10); // 10 es el número de rondas de salting

        // Crear el nuevo usuario
        const nuevoUsuario = await UsuarioModel.crearUsuario(nombre, email, contrasenaHasheada, ciudad, fechaNacimiento, fotoPerfil);


        return nuevoUsuario; // Retornar el usuario creado
    }
    // Método para obtener un usuario por su ID
    async obtenerUsuarioPorId(userId) {
        const usuario = await UsuarioModel.buscarPorId(userId); // modelo
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }
        return usuario;
    }


    // Método para actualizar el perfil del usuario
    async actualizarUsuario(userId, datosActualizados) {
        const usuario = await UsuarioModel.buscarPorId(userId);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        const usuarioActualizado = await UsuarioModel.actualizarUsuario(userId, datosActualizados);
        return usuarioActualizado;
    }

    async cambiarContrasena(userId, passwordActual, nuevaPassword) {
        const usuario = await UsuarioModel.buscarPorId(userId);
        if (!usuario) {
            throw new Error("Usuario no encontrado");
        }

        // Verificación de la contraseña actual
        const esPasswordValido = await bcrypt.compare(passwordActual, usuario.password);
        if (!esPasswordValido) {
            throw new Error("La contraseña actual es incorrecta");
        }

        // Hashear la nueva contraseña y actualizarla
        const nuevaPasswordHasheada = await bcrypt.hash(nuevaPassword, 10);
        await UsuarioModel.actualizarUsuario(userId, { password: nuevaPasswordHasheada });

        return { message: "Contraseña actualizada con éxito" };
    }
    async obtenerUsuarios(userId) {
        const usuarios = await UsuarioModel.obtenerUsuarios(userId);
        return usuarios;
    }
}



export const authService = new AuthService();


