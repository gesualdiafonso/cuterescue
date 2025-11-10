<<<<<<< HEAD
import React from "react"; 
import { Link } from "react-router-dom";
import BtnEditProfile from "./ui/BtnEditProfile";
=======
import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import BtnEditProfile from "./ui/BtnEditProfile";
import ModalEdicionUsuario from "./modals/ModalEdicionUsuario";
import { supabase } from "../services/supabase";

>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)

export default function DetailsInform( {details, ubicacion}){

  if (!details) return <div>Loading...</div>;
  const { 
    email,
    status,
    fechaNacimiento, 
    documento, 
    telefono, 
    genero, 
    nombre, 
    apellido,
    tipo_documento 
  } = details;

  const { direccion, codigoPostal, provincia, direccion_segura } = ubicacion || {}

  // ✅ Conversão lógica e cor condicional
 const esSegura = direccion_segura === true || direccion_segura === "true";
  const estadoSeguridad = esSegura ? "Sí" : "No";
  const colorSeguridad = esSegura ? "bg-green-500" : "bg-red-500";

<<<<<<< HEAD
  return (
    <div className="flex gap-10 justify-center items-center">
      <div className="bg-gray-200 w-72 h-80 rounded-2xl">
        <img src="#" alt="#" className="w-full h-full" />
=======
const [openModal, setOpenModal] = useState(false);
const [userData, setUserData] = useState(details);

const handleSave = async () => {
  // Trae los datos actualizados desde Supabase
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("id", details.id)
    .single();

  if (!error) setUserData(data);
};

  return (
    <div className="flex gap-10 justify-center items-center">
      <div className="bg-gray-200 w-72 h-80 rounded-2xl">
             <div className="relative bg-gray-200 w-72 h-80 rounded-2xl overflow-hidden">
  <img
    src={userData.foto_url || "/default-avatar.png"}
    alt="Foto de perfil"
    className="object-cover w-full h-full"
  />
  <button
    onClick={() => setOpenModal(true)}
    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-[#22687b] text-white px-4 py-1 rounded-lg text-sm hover:bg-[#1d5663]"
  >
    Editar foto
  </button>
</div>
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-bold text-4xl">{nombre + " " + apellido}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
          <p><strong>Fecha de nacimiento:</strong> {fechaNacimiento}</p>
          <p>
            <strong>Ubicación:  </strong> 
              { direccion + ", " + codigoPostal + ", " + provincia ||" No especificada"}  
              <span className={`${colorSeguridad} py-1 px-5 ml-2 rounded-2xl text-white`}>
                {estadoSeguridad}
              </span>
            </p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Teléfono:</strong> {telefono}</p>
          <p><strong>Documento:</strong> {tipo_documento}: {documento}</p>
          <p><strong>Género:</strong> {genero}</p>
          <p><strong>Plan:</strong> Premium 
            <Link to="/planos" className="ml-3 px-5 bg-[#f7a82a] text-white font-light rounded-2xl">
              Cambiar
            </Link>
          </p>
          <p><strong>GPS Activo:</strong> gps  
            <Link to="/gps-pets" className="ml-3 px-5 bg-[#22687b] text-white font-light rounded-2xl">
              Acceder
            </Link>
          </p>
        </div>
        <div>
<<<<<<< HEAD
          <BtnEditProfile />
        </div>
      </div>
=======
  

        </div>
      </div> <ModalEdicionUsuario
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  currentUser={userData}
  onSave={handleSave}
/>

>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)
    </div>
  );
}
