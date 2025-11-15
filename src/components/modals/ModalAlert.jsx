import React from "react";
import { useNavigate } from "react-router-dom";
import { useSavedData } from "../../context/SavedDataContext";

<<<<<<< HEAD
<<<<<<< HEAD
export default function ModalAlert({ show, alert, onClose }){
    const navigate = useNavigate();
    if(!show || !alert) return null;
=======
export default function ModalAlert({ show, alert, onClose }) {
  const navigate = useNavigate();
  const { setAlertOn } = useSavedData(); //  activa el modo emergencia
=======
export default function ModalAlert({ show, alert, onClose, variant = "activate" }) {
  const navigate = useNavigate();
  const { setAlertOn } = useSavedData();
>>>>>>> 254b876 (boton captura, emailJS, 2do modal emergencia, simulacion en pausa)

  if (!show || !alert) return null;
>>>>>>> 6a12757 (estado de emergencia hacia maps)

<<<<<<< HEAD
    const { color, title, message, button, redirect } = alert;
    

<<<<<<< HEAD
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div
                className="rounded-2xl p-8 text-center max-w-md w-full shadow-xl"
                style={{ backgroundColor: color }}
            >
                <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
                <p className="text-white text-lg mb-6">{message}</p>
                <div className="flex gap-4 justify-center">
                <button
                    onClick={() => {
                    onClose();
                    navigate(redirect);
                    }}
                    className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-100 transition"
                >
                    {button}
                </button>
                </div>
            </div>
        </div>
    );
}
=======
=======
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

>>>>>>> 254b876 (boton captura, emailJS, 2do modal emergencia, simulacion en pausa)
  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div
        className="rounded-2xl p-6 max-w-md text-center text-white shadow-lg"
        style={{ backgroundColor: color || "#FBC68F" }}
      >
<<<<<<< HEAD
        {/* <h2 className="text-2xl font-bold mb-4">{title}</h2> */}
        <h2 className="text-2xl font-bold mb-4">
          Has activado el botón de emergencia
        </h2>
=======
        <h2 className="text-2xl font-bold mb-4">{t.title}</h2>
>>>>>>> 254b876 (boton captura, emailJS, 2do modal emergencia, simulacion en pausa)

        <p className="text-white font-bold mb-4">{t.message}</p>

        {t.sub && (
          <p style={{ color: "#22687C" }} className="mb-6 font-bold text-lg">
            {t.sub}
          </p>
        )}

        <button
          onClick={() => {
<<<<<<< HEAD
            setAlertOn(true); //  activa modo emergencia
            onClose();        //  cierra el modal
            navigate(redirect || "/maps"); //  redirige
=======
            setAlertOn(true);
            onClose();
            navigate(t.redirect || "/maps");
>>>>>>> 254b876 (boton captura, emailJS, 2do modal emergencia, simulacion en pausa)
          }}
          className="bg-[#F7612A] text-white px-4 py-2 rounded-lg hover:bg-[#e6931f] transition"
        >
          {t.button}
        </button>
      </div>
    </div>
  );
}
>>>>>>> 6a12757 (estado de emergencia hacia maps)
