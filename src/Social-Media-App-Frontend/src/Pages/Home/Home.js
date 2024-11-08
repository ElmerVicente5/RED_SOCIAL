import { useState, useEffect } from 'react';
import Profile from "../../assets/Suggestion/avatar1.png";
import moment from 'moment/moment';

import "../Home/Home.css";
import Left from "../../Components/LeftSide/Left";
import Middle from "../../Components/MiddleSide/Middle";
import Right from '../../Components/RightSide/Right';
import Nav from '../../Components/Navigation/Nav';

const Home = ({ setFriendsProfile }) => {
    const [posts, setPosts] = useState([]);
    const [body, setBody] = useState("");
    const [importFile, setImportFile] = useState("");
    const [search, setSearch] = useState("");
    const [following, setFollowing] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [images, setImages] = useState(null);
    const [userName, setUserName] = useState("");
    const [profileImg, setProfileImg] = useState(Profile);
    const [modelDetails, setModelDetails] = useState({}); 
    const [name, setName] = useState("");
    // Fetch posts from the API on component mount
    useEffect(() => {
      const fetchPosts = async () => {
          try {
              // Obtener el token desde el localStorage
              const token = localStorage.getItem("token");
  
              const response = await fetch("http://localhost:8000/api/post/listarPostFriends", {
                  method: "GET",
                  headers: {
                      "Authorization": `Bearer ${token}`,
                      "Content-Type": "application/json"
                  }
              });
  
              const data = await response.json();
              
              if (data.publicaciones) {
                const fetchedPosts = data.publicaciones.map(post => ({
                  post_id: post.post_id, // Cambiado de `id: post.post_id`
                  username: post.autor,
                  profilepicture: post.foto_perfil ? `http://localhost:8000/${post.foto_perfil}`: Profile,
                  img: post.contenido_url ? `http://localhost:8000/${post.contenido_url}`:null,
                  datetime: moment(post.fecha_creacion).fromNow(),
                  body: post.contenido_texto,
                  like: parseInt(post.num_me_gusta),
                  comment: parseInt(post.num_comentarios),
                  unFilledLike: !post.has_liked,
              }));
                  setPosts(fetchedPosts);
              }
          } catch (error) {
              console.error("Error fetching posts:", error);
          }
      };
  
      fetchPosts();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch("http://localhost:8000/api/usuario/perfil", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.nombre);
          setUserName(`@${data.user_id}`);
          
          // Asegúrate de que la URL de la imagen sea accesible desde el frontend
          setProfileImg(data.foto_perfil ? `http://localhost:8000/${data.foto_perfil}`: Profile );
          
          setModelDetails({
            ModelName: data.nombre,
            ModelUserName: `@${data.user_id}`,
            ModelCountryName: data.ciudad || "No especificado",
            ModelJobName: data.role || "Usuario",
          });
        } else {
          console.error("Error fetching profile data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProfile();
  }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
        const username = "Vijay";
        const profilepicture = Profile;
        const datetime = moment.utc(new Date(), 'yyyy/MM/dd kk:mm:ss').local().startOf('seconds').fromNow();
        const img = images ? URL.createObjectURL(images) : null;

        const newPost = {
            id: id,
            profilepicture: profilepicture,
            username: username,
            datetime: datetime,
            img: img,
            body: body,
            like: 0,
            comment: 0,
        };

        setPosts([...posts, newPost]);
        setBody("");
        setImages(null);
    };

    return (
        <div className='interface'>
            <Nav 
                search={search}
                setSearch={setSearch}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
                profileImg={profileImg}
            />

            <div className="home">
                <Left 
              following={following}
              setFollowing={setFollowing}
              profileImg={profileImg}
              modelDetails={modelDetails} // Usamos los datos de la API
            />

                <Middle 
                    handleSubmit={handleSubmit}
                    body={body}
                    setBody={setBody}
                    importFile={importFile}
                    setImportFile={setImportFile}
                    posts={posts}
                    setPosts={setPosts}
                    search={search}
                    setFriendsProfile={setFriendsProfile}
                    images={images}
                    setImages={setImages}
                />

                <Right
                    showMenu={showMenu}
                    setShowMenu={setShowMenu}
                    following={following}
                    setFollowing={setFollowing}
                />
            </div>
        </div>
    );
};

export default Home;
