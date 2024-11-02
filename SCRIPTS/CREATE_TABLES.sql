--CREATE TABLE USERS
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    ciudad VARCHAR(100),
    foto_perfil TEXT
);


--CREATE TABLE POSTS
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    contenido_texto TEXT,--frontend
    contenido_url TEXT,--frontend
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--CREATE TABLE COMMENTS
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,--frontend---se va a traer el nombre
    contenido TEXT NOT NULL,---frontend-si
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


--CREATE TABLE REACTIONS
CREATE TABLE reactions (
    reaction_id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,--nombre de quien reacciono
    tipo VARCHAR(50) NOT NULL,--frontend (like, love, haha, wow, sad, angry)
    CONSTRAINT unique_reaction UNIQUE (post_id, user_id, tipo)
);


--CREATE TABLE FRIENDS
CREATE TABLE friends (
    friend_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    friend_user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,---frontend
    estado VARCHAR(50) CHECK (estado IN ('pendiente', 'aceptado', 'rechazado')) NOT NULL,
    CONSTRAINT unique_friendship UNIQUE (user_id, friend_user_id)
);


--CREATE TABLE CHATS
CREATE TABLE chats (
    chat_id SERIAL PRIMARY KEY,
    user1_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    user2_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT unique_chat UNIQUE (user1_id, user2_id)
);


--CREATE TABLES MESSAGES
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    chat_id INTEGER NOT NULL REFERENCES chats(chat_id) ON DELETE CASCADE,
    sender_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    contenido TEXT NOT NULL,--frontend
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
