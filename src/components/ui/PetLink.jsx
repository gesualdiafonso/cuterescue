import React from "react";
import { capitalizeAll } from "../../utils/text";

export default function PetLink({ pet }){

    if (!pet) return (
    <span className="text-gray-500 italic">🐾</span>
  );

    return(
        <div className="w-full flex gap-2 justify-center items-center">
            <div className="w-10 h-10">
                <img src={pet.foto_url} alt="Shimbinha" className="bg-gray-200 rounded-full w-full h-full object-cover"/>
            </div>
            <div>
                <span>{capitalizeAll(pet.nombre)}</span>
            </div>
        </div>
    )
}