import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import BtnViaje from "./ui/BtnViaje";
import BtnEmergency from "./ui/BtnEmergency";
import ModalViajeCard from "./modals/ModalViajeCard"; 
import ModalAlert from "./modals/ModalAlert";   
import { useSavedData } from "../context/SavedDataContext"; 


export default function PersonalInform({ details, locations }) {
  const [showModal, setShowModal] = useState(false); 

  const { 
    showAlert, 
    alert, 
    setAlert, 
    closeAlert 
  } = useSavedData();  //  TRAEMOS MODAL GLOBAL

  if (!details || !locations) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  const { nombre = "", apellido = "", foto_url = "" } = details || {};
  const { direccion = "", codigoPostal = "", provincia = "" } = locations || {};

  const capitalizeAll = (text = "") =>
    text
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-0">
      
      {/* Dirección */}
      <div className="flex flex-wrap gap-3 text-gray-700 text-sm sm:text-base">
        <span>{`${direccion}, ${codigoPostal}`}</span>
        <span>|</span>
        <span>{provincia}</span>
      </div>

      {/* Nombre */}
      <h2 className="font-bold text-2xl sm:text-6xl mt-4">
        {`${capitalizeAll(nombre)} ${capitalizeAll(apellido)}`}
      </h2>

      {/* Botones */}
      <div className="flex gap-3 flex-wrap mt-4">
        <BtnViaje onClick={() => setShowModal(true)} />

 
        <BtnEmergency 
          onClick={() =>
            setAlert({
              type: "emergency",
              color: "#F7612A",
              title: "Has activado el botón de emergencia",
              message: "La ubicación en tiempo real está activa.",
              button: "Seguir mirando",
              redirect: "/maps",
            })
          }
        />
      </div>

      {/* Avatar */}
      <div className="flex flex-row justify-end items-center gap-5">
        <div className="bg-gray-300 rounded-full w-16 h-16 sm:w-15 sm:h-15 overflow-hidden">
          <img
            src={foto_url || "/default-avatar.png"}
            alt={`Foto de ${nombre || "usuario"}`}
            className="w-full h-full object-cover"
          />
        </div>
        <Link
          to="/detalles"
          className="text-[#d5d5d5] hover:text-gray-700 text-sm sm:text-base mt-1"
        >
          Visualizar perfil
        </Link>
      </div>

      {/* Modal Viaje */}
      {showModal && <ModalViajeCard onClose={() => setShowModal(false)} />}

      {/* Modal Emergencia */}
      <ModalAlert 
        show={showAlert}
        alert={alert}
        onClose={closeAlert}
      />
      
    </div>
  );
}
