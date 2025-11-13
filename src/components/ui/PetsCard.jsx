import React from "react";
import AddPets from "../modals/AddPets";

export default function PetCards({ pets = [], selectedPet, setSelectedPet, onPetAdded, location }) {
  return (
    <div className="w-full h-full flex flex-row gap-10 items-center max-w-3xl overflow-x-scroll overflow-y-hidden pb-5">
      {pets && pets.length > 0 ? (
        <>
          {pets.map((pet) => {
            const { nombre, activo } = pet;
            const direccion = location?.direccion || "Ubicación no disponible";
            const status = activo ? "Activo" : "Inactivo";
            const isSelected = selectedPet?.id === pet.id;

            return (
              <article
                key={pet.id}
                onClick={() => setSelectedPet(pet.id)}
                className={`bg-[#22687b] w-[256px] flex-shrink-0 rounded-2xl h-auto p-5 flex justify-center flex-col cursor-pointer hover:scale-105 transition-transform
                  ${isSelected ? "ring-4 ring-[#71dd5b]/40" : ""}`}
              >
                <div className="w-full h-52 mb-5 bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={pet.foto_url || "#"}
                    alt={nombre}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-white flex flex-col justify-center">
                  <h4>{nombre}</h4>
                  <span>
                    <strong className="text-orange-300">Status: </strong>
                    <span className="bg-[#71dd5b] text-white px-2 text-center rounded-lg font-light">
                      {status}
                    </span>
                  </span>
                  <strong className="text-orange-300">Ubicación:</strong>
                  <span>{direccion}</span>
                </div>
              </article>
            );
          })}

          {/* Botão de adicionar pet aparece junto com os pets */}
          <AddPets onPetAdded={onPetAdded} />
        </>
      ) : (
        // Quando não há pets, só mostra o botão de adicionar
        <AddPets onPetAdded={onPetAdded} />
      )}
    </div>
  );
}
