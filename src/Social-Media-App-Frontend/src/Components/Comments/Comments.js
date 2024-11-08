import React, { useState } from 'react';
import "../Comments/Comments.css";
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

const Comments = ({ cmt }) => {
    const [booleonLike, setBooleonLike] = useState(false);
    const [likeCount, setLikeCount] = useState(cmt.likes);
    const [showDelete, setShowDelete] = useState(false); // Estado para controlar la eliminación

    const handleLikeToggle = () => {
        setBooleonLike(!booleonLike);
        setLikeCount(prevCount => booleonLike ? prevCount - 1 : prevCount + 1); // Actualizar el conteo de "likes"
    };

    return (
        <div className="overAllCommentList">
            <div className="commentList">
                <div className='commentList1'>
                    <div className="commentHead">
                        <div><img src={cmt.profilePic} alt={`${cmt.username}'s profile`} /></div>
                        <p><span>{cmt.username}</span>{cmt.comment}</p>
                    </div>

                    <div className="commentFooter">
                        <p>{cmt.time}</p>
                        <h4>{likeCount} likes</h4>
                    </div>
                </div>

                <div className="commentList2">
                    <p 
                        className='cp'
                        onClick={handleLikeToggle}
                        style={{ cursor: "pointer" }}
                    >
                        {booleonLike ? <FavoriteRoundedIcon /> : <FavoriteBorderOutlinedIcon />}
                    </p>
                    
                    
                    
                    {/* Mostrar confirmación si showDelete está activado */}
                    {showDelete && (
                        <div className="deleteConfirmation">
                            <p>¿Estás seguro de que deseas eliminar este comentario?</p>
                            <button onClick={() => setShowDelete(false)}>Cancelar</button>
                            <button onClick={() => {
                                // Aquí iría la lógica para eliminar el comentario
                                setShowDelete(false);
                            }}>
                                Confirmar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comments;
