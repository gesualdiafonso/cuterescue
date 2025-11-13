import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import BtnViaje from "./ui/BtnViaje";
import BtnEmergency from "./ui/BtnEmergency";
import ModalViajeCard from "./modals/ModalViajeCard"; 

export default function PersonalInform({ details, locations }) {
  const [showModal, setShowModal] = useState(false); // controla visibilidad del modal

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
      {/* Dirección y provincia */}
      <div className="flex flex-wrap gap-3 text-gray-700 text-sm sm:text-base">
        <span>{`${direccion}, ${codigoPostal}`}</span>
        <span>|</span>
        <span>{provincia}</span>
      </div>

      {/* Nombre */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex flex-col">
          <h2 className="font-bold text-2xl sm:text-6xl">
            {`${capitalizeAll(nombre)} ${capitalizeAll(apellido)}`}
          </h2>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 flex-wrap mt-4">
        <BtnViaje onClick={() => setShowModal(true)} /> 
        <BtnEmergency />
      </div>

      {/* Avatar + Link */}
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

      {/* Modal de viaje */}
      {showModal && (
        <ModalViajeCard onClose={() => setShowModal(false)} /> // 👈 lo mostramos solo si está activo
      )}
    </div>
  );
}
