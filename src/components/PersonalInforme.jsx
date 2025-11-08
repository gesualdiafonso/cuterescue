
import { Link } from "react-router-dom"
import BtnViaje from "./ui/BtnViaje"
import BtnEmergency from "./ui/BtnEmergency"


export default function PersonalInform( { details, locations }){
    
    if (!details) {
        return <div>Loading...</div>;
    }

    const { nombre, apellido } = details;
    const { direccion, codigo_postal, provincia } = locations
    const [firstName] = nombre.split(" ");

    return(
        <div className="w-full lg:w-1/2 flex flex-col gap-2">
            <div className="flex gap-5 px-5">
                <span>{direccion + " " + codigo_postal}</span>
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