import axios from 'axios';
import Info from './ProfileComponents/InfoProfile/Info';
import UserHome from '../UserHome/UserHome';
import Profile from "../../assets/profile.jpg";
import { useEffect, useState } from 'react';
import "../Profile/ProfileMiddle.css";
import moment from 'moment';
import ProfileInputPost from './ProfileComponents/ProfileInputPost';

const ProfileMiddle = ({
  following,
  search,
  images,
  setImages,
  profileImg,
  setProfileImg,
  name,
  setName,
  userName,
  setUserName,
  modelDetails,
  setModelDetails
}) => {
  const [userPostData, setUserPostData] = useState([]);
  const [body, setBody] = useState("");
  const [importFile, setImportFile] = useState("");
  const [searchResults, setSearchResults] = useState("");

  // Reemplaza 'tu_token_aqui' con el token real que usas para autenticarte
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Llama a la API para obtener las publicaciones del usuario
    axios.get('http://localhost:8000/api/post/postUser', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      const publicaciones = response.data.publicaciones.map(post => ({
        id: post.post_id,
        profilepicture: post.foto_perfil ? `http://localhost:8000/${post.foto_perfil}`: Profile,
        img: post.contenido_url ? `http://localhost:8000/${post.contenido_url}` : null,
        datetime: moment(post.fecha_creacion).fromNow(),
        body: post.contenido_texto,
        like: parseInt(post.num_me_gusta),
        comment: parseInt(post.num_comentarios)
      }));
      setUserPostData(publicaciones);
    })
    .catch(error => console.error('Error al obtener las publicaciones:', error));
  }, []);

  useEffect(() => {
    const searchData = userPostData.filter(val =>
      val.body.toLowerCase().includes(search.toLowerCase()) ||
      val.username.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(searchData);
  }, [userPostData, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = userPostData.length ? userPostData[userPostData.length - 1].id + 1 : 1;
    const username = "Vijay";
    const profilepicture = Profile;
    const datetime = moment.utc(new Date(), 'yyyy/MM/dd kk:mm:ss').local().startOf('seconds').fromNow();
    const img = images ? { img: URL.createObjectURL(images) } : null;

    const newPost = {
      id: id,
      profilepicture: profilepicture,
      username: username,
      datetime: datetime,
      img: img && img.img,
      body: body,
      like: 0,
      comment: 0
    };

    setUserPostData(prevPosts => [...prevPosts, newPost]);
    setBody("");
    setImages(null);
  };

  return (
    <div className='profileMiddle'>
      <Info 
        modelDetails={modelDetails}
        setModelDetails={setModelDetails}
        profileImg={profileImg}
        setProfileImg={setProfileImg}
        userPostData={userPostData}
        following={following}
        name={name}
        setName={setName}
        userName={userName}
        setUserName={setUserName}
      />
      <ProfileInputPost
        modelDetails={modelDetails}
        profileImg={profileImg}
        handleSubmit={handleSubmit}
        body={body}
        setBody={setBody}
        importFile={importFile}
        setImportFile={setImportFile}
        images={images}
        setImages={setImages}
      />
      <UserHome 
        modelDetails={modelDetails}
        profileImg={profileImg}
        setUserPostData={setUserPostData}
        userPostData={searchResults}
        images={images}
      />
    </div>
  );
}

export default ProfileMiddle;
