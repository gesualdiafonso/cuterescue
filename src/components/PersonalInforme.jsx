<<<<<<< HEAD

import { Link } from "react-router-dom"
import BtnViaje from "./ui/BtnViaje"
import BtnEmergency from "./ui/BtnEmergency"


export default function PersonalInform( { details, locations }){
    
    if (!details) {
        return <div>Loading...</div>;
    }

    const { nombre, apellido } = details;
    const { direccion, codigoPostal, provincia } = locations
    const [firstName] = nombre.split(" ");

    return(
        <div className="w-full lg:w-1/2 flex flex-col gap-2">
            <div className="flex gap-5 px-5">
                <span>{direccion + ", " + " " + codigoPostal}</span>
                <span>|</span>
                <span>{provincia}</span>
            </div>
            <div className="flex flex-col gap-4 px-5 mb-5">
                <h2 className="font-bold text-8xl">{nombre + " " + apellido}</h2>
                <div className="flex gap-5">
                   <BtnViaje/>
                   <BtnEmergency/>
                </div>
            </div>
            <div className="flex justify-center items-center gap-5">
                <div className="bg-gray-300 rounded-full w-16 h-16 text-center">
                    <img src="#" alt="#" className="w-full object-cover h-full" />
                </div>
                <div>
                    <h3 className="font-bold text-xl">{firstName}</h3>
                    <Link to="/detalles" className="text-[#d5d5d5] hover:text-gray-700">Visualizar perfil</Link>
                </div>
            </div>
        </div>
    )
}
=======
import { Link } from "react-router-dom";
import BtnViaje from "./ui/BtnViaje";
import BtnEmergency from "./ui/BtnEmergency";

export default function PersonalInform({ details, locations }) {
  if (!details || !locations) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const { nombre = "", apellido = "", foto_url = "" } = details || {};
  const { direccion = "", codigoPostal = "", provincia = "" } = locations || {};
  const [firstName] = nombre ? nombre.split(" ") : [""];

  const capitalize = (text = "") =>
    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  return (
    <div className="flex flex-col gap-6 p-4 lg:p-0">
      
      {/* Dirección y provincia */}
      <div className="flex flex-wrap gap-3 text-gray-700 text-sm sm:text-base">
        <span>{`${direccion}, ${codigoPostal}`}</span>
        <span>|</span>
        <span>{provincia}</span>
      </div>

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
            {`${capitalize(nombre)} ${capitalize(apellido)}`}
          </h2>
          <Link
            to="/detalles"
            className="text-[#d5d5d5] hover:text-gray-700 text-sm sm:text-base mt-1"
          >
            Visualizar perfil
          </Link>
        </div>
      </div>

      {/* Botones */}
      <div className="flex gap-3 flex-wrap mt-4">
        <BtnViaje />
        <BtnEmergency />
      </div>
    </div>
  );
}
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)
