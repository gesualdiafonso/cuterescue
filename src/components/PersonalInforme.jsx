import { Link } from "react-router-dom";
import BtnViaje from "./ui/BtnViaje";
import BtnEmergency from "./ui/BtnEmergency";
<<<<<<< HEAD

export default function PersonalInform({ details, locations }) {
=======
import ModalViajeCard from "./modals/ModalViajeCard"; 
import ModalAlert from "./modals/ModalAlert";   // 👈 IMPORTANTE
import { useSavedData } from "../context/SavedDataContext"; // 👈 IMPORTANTE


export default function PersonalInform({ details, locations }) {
  const [showModal, setShowModal] = useState(false); 

  const { 
    showAlert, 
    alert, 
    setAlert, 
    closeAlert 
  } = useSavedData();  // 👈 TRAEMOS MODAL GLOBAL

>>>>>>> 6a12757 (estado de emergencia hacia maps)
  if (!details || !locations) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  const { nombre = "", apellido = "", foto_url = "" } = details || {};
  const { direccion = "", codigoPostal = "", provincia = "" } = locations || {};

  // capitaliza todas las palabras de un texto
  const capitalizeAll = (text = "") =>
    text
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-0">
      
<<<<<<< HEAD
      {/* Dirección y provincia */}
=======
      {/* Dirección */}
>>>>>>> 6a12757 (estado de emergencia hacia maps)
      <div className="flex flex-wrap gap-3 text-gray-700 text-sm sm:text-base">
        <span>{`${direccion}, ${codigoPostal}`}</span>
        <span>|</span>
        <span>{provincia}</span>
      </div>

<<<<<<< HEAD
      {/* Avatar y nombre */}
      <div className="flex items-center gap-4 mt-4">
        <div className="bg-gray-300 rounded-full w-20 h-20 sm:w-24 sm:h-24 overflow-hidden">
          <img
            src={foto_url || "/default-avatar.png"}
            alt={`Foto de ${nombre || "usuario"}`}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <h2 className="font-bold text-2xl sm:text-3xl">
            {`${capitalizeAll(nombre)} ${capitalizeAll(apellido)}`}
          </h2>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 flex-wrap mt-4">
        <BtnViaje />
        <BtnEmergency />
         
      </div>
      <div className="flex flex-row justify-end-safe items-center gap-5">
=======
      {/* Nombre */}
      <h2 className="font-bold text-2xl sm:text-6xl mt-4">
        {`${capitalizeAll(nombre)} ${capitalizeAll(apellido)}`}
      </h2>

      {/* Botones */}
      <div className="flex gap-3 flex-wrap mt-4">
        <BtnViaje onClick={() => setShowModal(true)} />

        {/* 🔥 ESTE ES EL QUE ABRE EL MODAL DE EMERGENCIA */}
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
>>>>>>> 6a12757 (estado de emergencia hacia maps)
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
<<<<<<< HEAD
=======

      {/* Modal Viaje */}
      {showModal && <ModalViajeCard onClose={() => setShowModal(false)} />}

      {/* Modal Emergencia */}
      <ModalAlert 
        show={showAlert}
        alert={alert}
        onClose={closeAlert}
      />
>>>>>>> 6a12757 (estado de emergencia hacia maps)
    </div>
  );
}
