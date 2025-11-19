import React from "react";
import { useNavigate } from "react-router-dom";
import { useSavedData } from "../../context/SavedDataContext";

export default function ModalAlert({ show, alert, onClose }) {
  const navigate = useNavigate();
  const { setAlertOn } = useSavedData();

  if (!show || !alert) return null;

  const variant = alert.variant || "activate";

  const baseTexts = {
    activate: {
      title: "Has activado el botón de emergencia",
      message:
        "La activación de la ubicación en tiempo real ha sido activada, active sus notificaciones para que podamos ubicar a su mascota.",
      button: "Rastrear",
      redirect: "/maps"
    },
    ongoing: {
      title: "Tu mascota está actualmente en modo emergencia",
      message: "Puedes ver su ubicación en tiempo real en el mapa.",
      sub: "",
      button: "Ir al mapa",
      redirect: "/maps"
    }
  };

  const v = baseTexts[variant];

  const finalText = {
    title: v.title,
    message: v.message,
    sub: v.sub,
    button: v.button,
    redirect: v.redirect,
    color: alert.color || "#FBC68F"
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center">
      <div
        className="rounded-2xl p-6 max-w-md text-center text-white shadow-lg"
        style={{ backgroundColor: finalText.color }}
      >
        <h2 className="text-2xl font-bold mb-4">{finalText.title}</h2>

        <p className="text-white font-bold mb-4">{finalText.message}</p>

        {finalText.sub && (
          <p className="text-[#22687C] mb-6 font-bold text-lg">{finalText.sub}</p>
        )}

        <button
          onClick={() => {
            setAlertOn(true);
            onClose();
            navigate(finalText.redirect);
          }}
          className="bg-[#F7612A] text-white px-4 py-2 rounded-lg hover:bg-[#e6931f] transition"
        >
          {finalText.button}
        </button>
      </div>
    </div>
  );
}
