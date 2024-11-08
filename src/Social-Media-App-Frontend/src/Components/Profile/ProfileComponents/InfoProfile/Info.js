import React, { useState, useRef } from 'react';
import "../InfoProfile/Info.css";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import WorkOutlineRoundedIcon from '@mui/icons-material/WorkOutlineRounded';
import Info3 from "../../../../assets/Info-Dp/img-3.jpg";
import { LiaEdit } from "react-icons/lia";
import { IoCameraOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";
import { Link } from 'react-router-dom';
import ModelProfile from '../ModelProfile/ModelProfile';
import axios from 'axios';
import { API_URL } from '../../../../config/config';

const Info = ({
    userPostData,
    following,
    modelDetails,
    setModelDetails,
    profileImg,
    setProfileImg,
    name,
    setName,
    userName,
    setUserName
}) => {
    const [coverImg, setCoverImg] = useState(Info3);
    const importProfile = useRef();
    const importCover = useRef();
    const [profileImgFile, setProfileImgFile] = useState(null); // Estado para el archivo de imagen de perfil
    const [openEdit, setOpenEdit] = useState(false);
    const [countryName, setCountryName] = useState("");
    const [jobName, setJobName] = useState("");

    // Función para manejar la selección de la imagen del perfil
    const handleFile1 = (e) => {
        console.log("Obteniendo imagen de perfil...");
        if (e.target.files && e.target.files[0]) {
            let img = e.target.files[0];
            setProfileImgFile(img); // Guardamos el archivo en el estado
            const imgObj = { image: URL.createObjectURL(img) };
            setProfileImg(imgObj.image); // Mostramos la imagen seleccionada en el perfil
            console.log("Imagen de perfil seleccionada:", img);
        }
    };

    // Función para manejar el clic en el ícono de la cámara para cambiar la imagen de perfil
    const handleProfileClick = () => {
        console.log("Entrando a handleProfileClick...");
        if (importProfile.current) {
            importProfile.current.click();
        } else {
            console.error('Referencia no encontrada para el perfil');
        }
    };

    // Función para subir la imagen del perfil al servidor
    const handleUpload = async () => {
        console.log("Entrando a handleUpload...");
        
        // Verifica que haya un archivo seleccionado antes de continuar
        if (!profileImgFile) {
            console.warn("No se ha seleccionado ninguna imagen para subir");
            alert("Por favor, selecciona una imagen primero.");
            return;
        }
    
        const formData = new FormData();
        formData.append("imagen", profileImgFile);
    
        const token = localStorage.getItem("token");
    
        if (!token) {
            console.error("Token de autorización no encontrado.");
            alert("No se encontró token de autorización.");
            return;
        }
    
        try {
            console.log("Iniciando subida de imagen...");
            const response = await axios.post(`${API_URL}/api/usuario/cargar-imagen`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
    
            if (response.status === 200) {
                alert("Imagen cargada exitosamente");
                console.log("Respuesta del servidor:", response.data); // Verifica la respuesta del servidor
            } else {
                console.error("Error en la respuesta:", response);
                alert("Error al cargar la imagen");
            }
        } catch (error) {
            console.error("Error al intentar cargar la imagen:", error);
            alert("Error al cargar la imagen");
        }
    };

    // Función para manejar la edición del perfil
    const handleModel = (e) => {
        e.preventDefault();

        const ModelName = name;
        const ModelUserName = userName;
        const ModelCountryName = countryName;
        const ModelJobName = jobName;

        let obj = {
            ModelName: ModelName,
            ModelUserName: ModelUserName,
            ModelCountryName: ModelCountryName,
            ModelJobName: ModelJobName,
        };

        setModelDetails(obj);
        setOpenEdit(false);
    };

    return (
        <div className='info'>
            <div className="info-cover">
                <img src={coverImg} alt="Cover" />
                <img src={profileImg} alt="Profile" />
                <div className='coverDiv'>
                    <IoCameraOutline className='coverSvg' onClick={() => importCover.current.click()} />
                </div>
                <div className='profileDiv'>
                    <IoCameraOutline className='profileSvg' onClick={handleProfileClick} />
                </div>
            </div>

            <input
                type="file"
                ref={importProfile}
                onChange={handleFile1}
                style={{ display: "none" }}
            />

            <button onClick={handleUpload}>Subir Imagen</button>

            <div className="info-follow">
                <h1>{modelDetails.ModelName}</h1>
                <p>{modelDetails.ModelUserName}</p>

                <Link to="/" className='logout'>
                    <BiLogOut />Logout
                </Link>

                <button onClick={() => setOpenEdit(true)}>
                    <LiaEdit /> Edit Profile
                </button>
                <ModelProfile
                    name={name}
                    setName={setName}
                    userName={userName}
                    setUserName={setUserName}
                    countryName={countryName}
                    setCountryName={setCountryName}
                    jobName={jobName}
                    setJobName={setJobName}
                    handleModel={handleModel}
                    openEdit={openEdit}
                    setOpenEdit={setOpenEdit}
                />

                <div className="info-details">
                    <div className="info-col-1">
                        <div className="info-details-list">
                            <LocationOnOutlinedIcon />
                            <span>{modelDetails.ModelCountryName}</span>
                        </div>

                        <div className="info-details-list">
                            <WorkOutlineRoundedIcon />
                            <span>{modelDetails.ModelJobName}</span>
                        </div>

                        <div className="info-details-list">
                            <CalendarMonthRoundedIcon />
                            <span>Joined in 2023-08-12</span>
                        </div>
                    </div>

                    <div className="info-col-2">
                        <div>
                            <h2>2,000</h2>
                            <span>Followers</span>
                        </div>
                        <div>
                            <h2>{userPostData.length}</h2>
                            <span>Posts</span>
                        </div>
                        <div>
                            <h2>{following}</h2>
                            <span>Following</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Info;
