import React from "react";
import AddPets from "../modals/AddPets";

export default function PetsCard({ pets = [], selectedPet, setSelectedPet, onPetAdded }) {
  return (
    <div className="w-full h-full flex flex-row gap-10 items-center max-w-3xl overflow-x-scroll overflow-y-hidden pb-5">
      {pets && pets.length > 0 ? (
        <>
          {pets.map((pet) => {
            const { nombre, activo, localizacion, foto_url } = pet;
            const direccion = localizacion?.direccion || "Ubicación no disponible";
            const status = activo ? "Activo" : "Inactivo";
            const isSelected = selectedPet?.id === pet.id;

            return (
              <article
                key={pet.id}
                onClick={() => setSelectedPet(pet)}
                className={`bg-[#22687b] w-[256px] h-[420px] flex-shrink-0 rounded-2xl  p-5 flex  flex-col cursor-pointer hover:scale-105 transition-transform 
                  ${isSelected ? "ring-4 ring-[#71dd5b]/40" : ""}`}
              >
                <div className="w-full h-60 mb-5 bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={foto_url || "https://via.placeholder.com/256x208?text=Mascota"}
                    alt={nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white flex flex-col justify-center">
                  <h4>{nombre}</h4>
                  <span>
                    <strong className="text-orange-300">Status: </strong>
                    <span className="bg-[#71dd5b] text-white text-center rounded-lg font-light py-1 px-2">
                      {status}
                    </span>
                  </span>
                  <strong className="text-orange-300">Ubicación:</strong>
                  <span className=" h-[70px]">{direccion}</span>
                </div>
              </article>
            );
          })}
          <AddPets onPetAdded={onPetAdded} />
        </>
      ) : (
        <AddPets onPetAdded={onPetAdded} />
      )}
    </div>
  );
}
