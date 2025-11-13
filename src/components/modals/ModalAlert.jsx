import React from "react";
import { useNavigate } from "react-router-dom";

export default function ModalAlert({ show, alert, onClose }) {
  const navigate = useNavigate();
  if (!show || !alert) return null;

  const { color, title, message, button, redirect } = alert;

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className="rounded-2xl p-6 max-w-md text-center text-white shadow-lg"
        style={{ backgroundColor: color || "#FBC68F" }}
      >
      {/*  <h2 className="text-2xl font-bold mb-4">{title}</h2>  descomentar a futuro*/ }
        <h2 className="text-2xl font-bold mb-4">Has activado el botón de emergencia</h2>

        <p className="text-white font-bold mb-4">
          Un alerta fue envíado al chip, la activación de la ubicación en tiempo real ha sido activada, esté atenta en su casilla de mail, active sus notificaciones para que esté ubicando su pet.
        </p>

        <p style={{color:"#22687C"}} className="mb-6 font-bold text-lg">
          Te enviaremos los movimientos de tu mascota en un tiempo estimado de cada 20 minutos
        </p>

        <button
          onClick={() => {
            onClose();
            navigate(redirect);
          }}
          className="bg-[#F7612A] text-white px-4 py-2 rounded-lg hover:bg-[#e6931f] transition"
        >
          {button || "Seguir mirando"}
        </button>
      </div>
    </div>
  );
}
