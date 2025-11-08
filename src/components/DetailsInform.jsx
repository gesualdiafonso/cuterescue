import React from "react"; 
import { Link } from "react-router-dom";
import BtnEditProfile from "./ui/BtnEditProfile";

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

  return (
    <div className="flex gap-10 justify-center items-center">
      <div className="bg-gray-200 w-72 h-80 rounded-2xl">
        <img src="#" alt="#" className="w-full h-full" />
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
          <BtnEditProfile />
        </div>
      </div>
    </div>
  );
}
