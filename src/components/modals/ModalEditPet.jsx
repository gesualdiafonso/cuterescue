import React, { useState } from "react";
import { supabase } from "../../services/supabase";
import { setSelectedPet } from "../../services/SelectedPet";

export default function ModalEditPet({ pet, onClose, onUpdated }) {
  const [formData, setFormData] = useState(pet || {});
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  }

  async function handleSave() {
    setLoading(true);

    try {
      // 🔹 1. Crear un objeto SOLO con columnas válidas de la tabla "mascotas"
      const updatePayload = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        color: formData.color,
        sexo: formData.sexo,
        estado_salud: formData.estado_salud,
        peso: formData.peso,
        fecha_nacimiento: formData.fecha_nacimiento,
        foto_url: formData.foto_url,
      };

      // 🔹 2. PATCH a Supabase
      const { data, error } = await supabase
        .from("mascotas")
        .update(updatePayload)
        .eq("id", pet.id)
        .select()
        .single();

      if (error) {
        console.error(error);
        alert("Error actualizando mascota");
        return;
      }

      // 🔹 3. Actualizar el global selectedPet
      setSelectedPet(data);

      // 🔹 4. Actualizar lista en InformePet
      if (onUpdated) onUpdated(data);

      onClose();

    } catch (err) {
      console.error(err);

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-500/80 flex items-center justify-center z-50">
      <div className="bg-[#22687B] p-10 rounded-2xl w-[600px] max-h-[90vh] overflow-y-auto shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-white">Editar información del Pet</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {[
            "nombre",
            "especie",
            "raza",
            "color",
            "sexo",
            "estado_salud",
            "peso"
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="font-light text-lg text-white capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="bg-white border border-[#F7A82A] p-2 mt-2 focus:outline-none"
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label className="font-light text-lg text-white">Fecha de nacimiento</label>
            <input
              type="date"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento || ""}
              onChange={handleChange}
              className="bg-white border border-[#F7A82A] p-2 mt-2 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-5 mt-8 justify-end">
          <button onClick={onClose} className="bg-[#007DC4] px-5 py-2 rounded-xl text-white">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-[#2EC6F0] text-white px-5 py-2 rounded-xl"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}
