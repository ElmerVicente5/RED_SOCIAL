import { useState, useEffect } from 'react';
import Left from '../../Components/LeftSide/Left';
import ProfileMiddle from '../../Components/Profile/ProfileMiddle';
import Right from '../../Components/RightSide/Right';
import Nav from '../../Components/Navigation/Nav';
import "../Profile/Profile.css";
import ProfileImg from "../../assets/Suggestion/avatar1.png";
import { API_URL } from '../../config/config';
const Profile = () => {
  const [following, setFollowing] = useState(3);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [images, setImages] = useState(null);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImg, setProfileImg] = useState(ProfileImg);
  const [modelDetails, setModelDetails] = useState({}); 

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${API_URL}/api/usuario/perfil`, {
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
          setProfileImg(data.foto_perfil ? `${API_URL}/${data.foto_perfil}`: ProfileImg );
          
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
        <ProfileMiddle 
          following={following}
          search={search}
          images={images}
          setImages={setImages}
          name={name}
          setName={setName}
          userName={userName}
          setUserName={setUserName}
          profileImg={profileImg}
          setProfileImg={setProfileImg}
          modelDetails={modelDetails} // Usamos los datos de la API
          setModelDetails={setModelDetails}
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

export default Profile;
