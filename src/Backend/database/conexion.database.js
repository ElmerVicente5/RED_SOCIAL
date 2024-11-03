import knex from 'knex';
import 'dotenv/config';

// Configuración de la conexión a la base de datos usando knex
export const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  pool: { min: 0, max: 10 } // Configuración opcional del pool de conexiones
});

// Función para validar y crear tablas si no existen
const checkAndCreateTables = async () => {
  try {
    // Tabla usuarios
    const existsUsers = await db.schema.hasTable('users');
    if (!existsUsers) {
      await db.schema.createTable('users', (table) => {
        table.increments('user_id').primary();
        table.string('nombre', 100).notNullable();
        table.date('fecha_nacimiento');
        table.string('email', 255).unique().notNullable();
        table.string('password', 255).notNullable();
        table.string('ciudad', 100);
        table.text('foto_perfil');
        table.string('role', 50);
      });
      console.log('Tabla "users" creada');
    } else {
      console.log('Tabla "users" ya existe');
    }

    // Tabla posts
    const existsPosts = await db.schema.hasTable('posts');
    if (!existsPosts) {
      await db.schema.createTable('posts', (table) => {
        table.increments('post_id').primary();
        table.integer('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.text('contenido_texto');
        table.text('contenido_url');
        table.timestamp('fecha_creacion').defaultTo(db.fn.now());
      });
      console.log('Tabla "posts" creada');
    } else {
      console.log('Tabla "posts" ya existe');
    }

    // Tabla comments
    const existsComments = await db.schema.hasTable('comments');
    if (!existsComments) {
      await db.schema.createTable('comments', (table) => {
        table.increments('comment_id').primary();
        table.integer('post_id').notNullable().references('post_id').inTable('posts').onDelete('CASCADE');
        table.integer('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.text('contenido').notNullable();
        table.timestamp('fecha_creacion').defaultTo(db.fn.now());
      });
      console.log('Tabla "comments" creada');
    } else {
      console.log('Tabla "comments" ya existe');
    }

    // Tabla reactions
    const existsReactions = await db.schema.hasTable('reactions');
    if (!existsReactions) {
      await db.schema.createTable('reactions', (table) => {
        table.increments('reaction_id').primary();
        table.integer('post_id').notNullable().references('post_id').inTable('posts').onDelete('CASCADE');
        table.integer('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.string('tipo', 50).notNullable();
        table.unique(['post_id', 'user_id', 'tipo']);
      });
      console.log('Tabla "reactions" creada');
    } else {
      console.log('Tabla "reactions" ya existe');
    }

    // Tabla friends
  // Tabla friends
  const existsFriends = await db.schema.hasTable('friends');
  if (!existsFriends) {
    await db.schema.createTable('friends', (table) => {
      table.increments('friend_id').primary();
      table.integer('user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
      table.integer('friend_user_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
      table.string('estado', 50).notNullable();
      table.unique(['user_id', 'friend_user_id']);
    });
    console.log('Tabla "friends" creada');
  } else {
    console.log('Tabla "friends" ya existe');
  }

    // Tabla chats
    const existsChats = await db.schema.hasTable('chats');
    if (!existsChats) {
      await db.schema.createTable('chats', (table) => {
        table.increments('chat_id').primary();
        table.integer('user1_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.integer('user2_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.unique(['user1_id', 'user2_id']);
      });
      console.log('Tabla "chats" creada');
    } else {
      console.log('Tabla "chats" ya existe');
    }

    // Tabla messages
    const existsMessages = await db.schema.hasTable('messages');
    if (!existsMessages) {
      await db.schema.createTable('messages', (table) => {
        table.increments('message_id').primary();
        table.integer('chat_id').notNullable().references('chat_id').inTable('chats').onDelete('CASCADE');
        table.integer('sender_id').notNullable().references('user_id').inTable('users').onDelete('CASCADE');
        table.text('contenido').notNullable();
        table.timestamp('fecha_envio').defaultTo(db.fn.now());
      });
      console.log('Tabla "messages" creada');
    } else {
      console.log('Tabla "messages" ya existe');
    }

  } catch (error) {
    console.error('Error al verificar o crear las tablas', error);
  }
};

// Función para probar la conexión a la base de datos
const testConnection = async () => {
  try {
    const result = await db.raw('SELECT NOW()');
    console.log('Conexión exitosa a la base de datos:', result.rows[0]);
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
  }
};

// Llama a las funciones para verificar tablas y probar la conexión
(async () => {
  await testConnection();
  await checkAndCreateTables();
})();
