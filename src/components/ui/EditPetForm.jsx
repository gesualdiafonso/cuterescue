import React from "react";

export default function EditPetForm({ selectedPet, onEditClick, onDeleteClick  }) {
  if (!selectedPet) return <div className="felx justify-center items-center"><h2 className="text-3xl font-black text-center my-10">Todavía el Pet no ha sido agregado</h2></div>;

  const { nombre, especie, raza, fecha_nacimiento, edad, sexo, color, estado_salud, activo } = selectedPet;

  return (
    <div className="flex gap-20 justify-center items-center w-full mb-10">
      <div className="w-60 h-80 bg-gray-200 rounded-2xl">
        <img src="#" alt={nombre} className="w-full h-full" />
      </div>

      <form className="flex flex-col gap-10 w-2/3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-10">
          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Nombre</label>
            <input
              type="text"
              value={nombre}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Especie</label>
            <input
              type="text"
              value={especie}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Raza</label>
            <input
              type="text"
              value={raza}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Fecha de Nacimiento</label>
            <input
              type="text"
              value={fecha_nacimiento}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Sexo</label>
            <input
              type="text"
              value={sexo}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Color</label>
            <input
              type="text"
              value={color}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Estado de salud</label>
            <input
              type="text"
              value={estado_salud}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Activo</label>
            <input
              type="text"
              value={activo ? "Sí" : "No"}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>
        </div>

        <div className="flex gap-5 w-full">
          <button
            type="button"
            onClick={onEditClick}
            className="w-full bg-white border border-[#22687c] font-black py-2 rounded-xl"
          >
            Editar informes
          </button>
          <button className="w-full bg-[#22687c] text-white font-black py-2 rounded-xl">
            Borrar Pet
          </button>
          <button 
            type="button"
            onClick={onDeleteClick}
            className="w-full bg-[#fbc68f] text-white font-black py-2 rounded-xl">
            Informe Chip
          </button>
        </div>
      </form>
    </div>
  );
}
