import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import { UsuarioModel } from '../models/usuario.model.js'; 
import { config } from './config.js';
import bcrypt from 'bcryptjs';

// Configuración de la estrategia de Google
passport.use(new GoogleStrategy({
    clientID: config.googleClientId,
    clientSecret: config.googleClientSecret,
    callbackURL: '/api/usuario/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Lógica para encontrar o crear un usuario
        let usuarioExistente = await UsuarioModel.buscarPorEmail(profile.emails[0].value);

        if (usuarioExistente) { 
            return done(null, usuarioExistente);
        }

        // Si el usuario no existe, crear uno nuevo
        const nombre = profile.name.givenName || null; // Si no existe, pasa null
        const email = profile.emails[0].value;
        const ciudad = null; // Valor por defecto, ya que no se obtiene de Google
        const fechaNacimiento = null; // Valor por defecto, ya que no se obtiene de Google
        const fotoPerfil = null; // Valor por defecto, ya que no se obtiene de Google

        // Hashear la contraseña
        const contrasenaHasheada = await bcrypt.hash('password', 10); // Contraseña temporal hasheada
        
        // Crear el nuevo usuario
        const newUser = await UsuarioModel.crearUsuario(
            nombre,
            email,
            contrasenaHasheada,
            ciudad,
            fechaNacimiento,
            fotoPerfil,
            'usuario' // Rol por defecto
        );

        console.log('Nuevo usuario creado:', newUser);

        done(null, newUser); 
    } catch (error) {
        console.error("Error al autenticar el usuario con Google:", error); 
        done(error, null);
    }
}));

// Serialización de usuario
passport.serializeUser((user, done) => {
    done(null, user.user_id); // Cambiado a user_id
});

// Deserialización de usuario
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UsuarioModel.buscarPorId(id); // Cambiado a buscarPorId
        done(null, user); 
    } catch (error) {
        console.error("Error al deserializar el usuario:", error); 
        done(error, null);
    }
});
