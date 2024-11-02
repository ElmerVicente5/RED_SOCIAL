--CONSULTAS RED SOCIAL

--CONSULTA PARA INSERT DE LA REACCION DE LIKE
INSERT INTO reactions (post_id, user_id, tipo)
VALUES (#POST_ID, #USER_ID, 'Me gusta');

knex('reactions')
  .insert({
    post_id: POST_ID,
    user_id: USER_ID,
    tipo: 'Me gusta'
  })
  .then(() => console.log("Reacción insertada"))
  .catch(error => console.error(error));


--CONSULTA DE UPDATE DEL ESTADO DE LA SOLICITUD
UPDATE friends
SET estado = '#ESTADO'
WHERE user_id = #USER_ID AND FRIEND_USER_ID = #FRIEND_USER_ID;


knex('friends')
  .where({
    user_id: USER_ID,
    friend_user_id: FRIEND_USER_ID
  })
  .update({
    estado: ESTADO
  })
  .then(() => console.log("Estado de la solicitud actualizado"))
  .catch(error => console.error(error));


--CONSULTA PARA TRAER TODOS LOS MENSAJES DEL CHAT
SELECT message_id, sender_id, contenido, fecha_envio
FROM messages
WHERE CHAT_ID = #CHAT_ID
ORDER BY fecha_envio ASC;


knex('messages')
  .select('message_id', 'sender_id', 'contenido', 'fecha_envio')
  .where('chat_id', CHAT_ID)
  .orderBy('fecha_envio', 'asc')
  .then(messages => console.log(messages))
  .catch(error => console.error(error));


--CONSULTA QUE ME MUESTRE TODOS LO COMENTARIOS DE UN POST
SELECT c.comment_id, u.nombre AS usuario, c.contenido, c.fecha_creacion
FROM comments c
JOIN users u ON c.user_id = #U.USER_ID
WHERE c.post_id = #POST_ID
ORDER BY c.fecha_creacion ASC;


knex('comments as c')
  .join('users as u', 'c.user_id', 'u.user_id')
  .select('c.comment_id', 'u.nombre as usuario', 'c.contenido', 'c.fecha_creacion')
  .where('c.post_id', POST_ID)
  .orderBy('c.fecha_creacion', 'asc')
  .then(comments => console.log(comments))
  .catch(error => console.error(error));


--CONSULTA PARA INSERTAR UN POST
INSERT INTO comments (post_id, user_id, contenido)
VALUES (#POST_ID, #USER_ID, 'Este es mi comentario.');


knex('comments')
  .insert({
    post_id: POST_ID,
    user_id: USER_ID,
    contenido: 'Este es mi comentario.'
  })
  .then(() => console.log("Comentario insertado"))
  .catch(error => console.error(error));
