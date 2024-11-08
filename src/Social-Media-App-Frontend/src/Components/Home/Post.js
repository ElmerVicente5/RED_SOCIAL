import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Link } from 'react-router-dom';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SentimentSatisfiedRoundedIcon from '@mui/icons-material/SentimentSatisfiedRounded';
import img1 from "../../assets/Following/img-2.jpg";
import img2 from "../../assets/Following/img-3.jpg";
import img3 from "../../assets/Following/img-4.jpg";
import Profile from "../../assets/Suggestion/avatar1.png";
import Comments from '../Comments/Comments';

// Configurar instancia de Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/post',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
});

const Post = ({ post, posts, setPosts, setFriendsProfile, images }) => {
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(post.like);
  const [unlike, setUnlike] = useState(false);
  const [filledLike, setFilledLike] = useState(<FavoriteBorderOutlinedIcon />);
  const [unFilledLike, setUnFilledLike] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [showDelete, setShowDelete] = useState(false); 

  useEffect(() => {
    // Cargar comentarios para cada publicación al mostrar comentarios
    if (showComment) fetchComments();
  }, [showComment]);

  // Función para cargar comentarios de una publicación
  const fetchComments = async () => {
    try {
      const response = await axiosInstance.post(`/obtener-comentarios`, {
        post_id: post.post_id
      });
      
      // Asegúrate de que los comentarios tengan las propiedades correctas
      const mappedComments = response.data.comentarios.map(cmt => ({
        id: cmt.comment_id,
        username: cmt.usuario,
        comment: cmt.contenido,
        profilePic: cmt.foto_perfil ?  `http://localhost:8000/${cmt.foto_perfil}`: Profile, // Si no tienes imagen de perfil, puedes agregar una predeterminada
        time: moment.utc(cmt.fecha_creacion).local().startOf('seconds').fromNow()
      }));
  
      setComments(mappedComments);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    }
  };

  // Función para manejar los likes
  const handleLike = async () => {
    try {
      await axiosInstance.post(`/darMegusta`, { post_id: post.post_id });
      setLike(unlike ? like - 1 : like + 1);
      setUnlike(!unlike);
      setFilledLike(unFilledLike ? <FavoriteBorderOutlinedIcon /> : <FavoriteRoundedIcon />);
      setUnFilledLike(!unFilledLike);
    } catch (error) {
      console.error("Error al dar 'Me Gusta':", error);
    }
  };

  // Función para agregar un nuevo comentario
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/comentar`, {
        post_id: post.post_id,
        contenido: commentInput
      });
      const newComment = {
        id: response.data.comentario.comment_id,
        profilePic: Profile,
        username: "Anonymus", // Puedes usar el nombre de usuario autenticado
        comment: commentInput,
        time: moment.utc(response.data.comentario.fecha_creacion).local().startOf('seconds').fromNow()
      };
      setComments([...comments, newComment]);
      setCommentInput("");
    } catch (error) {
      console.error("Error al agregar comentario:", error);
    }
  };

  return (
    <div className='post'>
      <div className='post-header'>
        <Link to="/FriendsId" style={{ textDecoration: "none" }}>
          <div className='post-user' onClick={() => setFriendsProfile([post])} style={{ cursor: "pointer" }}>
            <img src={post.profilepicture} className='p-img' alt="" />
            <h2>{post.username}</h2>
            <p className='datePara'>{post.datetime}</p>
          </div>
        </Link>
        <MoreVertRoundedIcon className='post-vertical-icon' onClick={() => setShowDelete(!showDelete)} />
      </div>
      <p className='body'>
        {post.body.length <= 300 ? post.body : `${post.body.slice(0, 300)}...`}
      </p>
      {post.img && <img src={post.img} alt="" className="post-img" />}
      
      <div className="post-foot">
        <div className="post-footer">
          <div className="like-icons">
            <p className='heart' onClick={handleLike} style={{ marginTop: "5px" }}>
              {filledLike}
            </p>
            <MessageRoundedIcon onClick={() => setShowComment(!showComment)} className='msg' />
            <ShareOutlinedIcon className='share' />
          </div>
          <div className="like-comment-details">
            <span className='post-like'>{like} people like it,</span>
            <span className='post-comment'>{comments.length} comments</span>
          </div>
          
          {showComment && (
            <div className="commentSection">
              <form onSubmit={handleAddComment}>
                <div className="cmtGroup">
                  <SentimentSatisfiedRoundedIcon className='emoji' />
                  <input 
                    type="text"
                    required
                    placeholder='Add a comment...'
                    onChange={(e) => setCommentInput(e.target.value)}
                    value={commentInput}
                  />
                  <button type='submit'><SendRoundedIcon className='send' /></button>
                </div>
              </form>
              <div className="sticky">
                {comments.map((cmt) => (
                  <Comments className="classComment" cmt={cmt} key={cmt.id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Post;
