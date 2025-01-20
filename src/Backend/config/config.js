import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Exportar las configuraciones
export const config = {
    databaseUrl: process.env.DATABASE_URL,
    jwtSecret: process.env.JWT_SECRET||'mySuperSecretKey1234567890',
    port: process.env.PORT || 8000 ,// Si no hay puerto definido, usar 8000 por defecto
    googleClientId:'your-id',
    googleClientSecret:'yoursecret'
};
