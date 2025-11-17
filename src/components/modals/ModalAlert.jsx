import React from "react";
import { useNavigate } from "react-router-dom";
import { useSavedData } from "../../context/SavedDataContext";

export default function ModalAlert({ show, alert, onClose, variant = "activate" }) {
  const navigate = useNavigate();
  const { setAlertOn } = useSavedData();

  if (!show || !alert) return null;

  // Si viene un alert.global usamos esos valores
  const { color, title, message, button, redirect } = alert;

  //  TEXTOS SEGÚN EL MODO (modal de emergencia 1 o 2)
  const texts = {
    activate: {
      title: "Has activado el botón de emergencia",
      message:
        "Un alerta fue enviado al chip y la ubicación en tiempo real ha sido activada. Mantente atenta a tu casilla de mail mientras rastreamos a tu mascota.",
      sub:
        "Te enviaremos los movimientos de tu mascota en intervalos estimados de 20 minutos.",
      button: "Seguir mirando",
    },
    ongoing: {
      title: "Tu mascota está actualmente en modo emergencia",
      message: "Puedes ver su ubicación en tiempo real en el mapa.",
      sub: "",
      button: "Ir al mapa",
    },
  };

  // toma los textos según variante pero dejando sobreescribir si mando un alert personalizado
  const t = {
    title: title || texts[variant].title,
    message: message || texts[variant].message,
    sub: texts[variant].sub,
    button: button || texts[variant].button,
    redirect: redirect,
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className="rounded-2xl p-6 max-w-md text-center text-white shadow-lg"
        style={{ backgroundColor: color || "#FBC68F" }}
      >
        <h2 className="text-2xl font-bold mb-4">{t.title}</h2>

        <p className="text-white font-bold mb-4">{t.message}</p>

        {t.sub && (
          <p style={{ color: "#22687C" }} className="mb-6 font-bold text-lg">
            {t.sub}
          </p>
        )}

        <button
          onClick={() => {
            setAlertOn(true);
            onClose();
            navigate(t.redirect || "/maps");
          }}
          className="bg-[#F7612A] text-white px-4 py-2 rounded-lg hover:bg-[#e6931f] transition"
        >
          {t.button}
        </button>
      </div>
    </div>
  );
}