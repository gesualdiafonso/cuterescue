import React, { useState } from "react";

export default function ModalEditPet({ pet, onClose }) {
  const [formData, setFormData] = useState(pet || {});

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSave() {
    console.log("Salvar alterações:", formData);
    // Aqui vai o fetch PUT para atualizar o pet via API
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-gray-500/80 flex items-center justify-center z-50">
      <div className="bg-[#22687B] p-10 rounded-2xl w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-white">Editar informações do pet</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {["nombre", "especie", "raza", "color", "sexo", "estado_salud", "edad"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="font-light text-lg text-white capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="bg-white border border-[#F7A82A] p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="font-light text-lg text-white">Fecha de Nacimiento</label>
            <input
              type="text"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento || ""}
              onChange={handleChange}
              className="bg-white border border-[#F7A82A] p-2 mt-2 focus:outline-none focus:ring-2 focus:ring-cyan-600"
            />
          </div>
        </div>

        <div className="flex gap-5 mt-8 justify-end">
          <button onClick={onClose} className="bg-[#007DC4] px-5 py-2 rounded-xl text-white">
            Cancelar
          </button>
          <button onClick={handleSave} className="bg-[#2EC6F0] text-white px-5 py-2 rounded-xl">
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}
