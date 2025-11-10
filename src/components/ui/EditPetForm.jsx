import React, { useState } from "react";
import EditPetModal from "../modals/EditPetModal";
import { supabase } from "../../services/supabase";

export default function EditPetView({
  selectedPet,
  location,
  ubicacion,
  refreshPets, // callback para actualizar la lista después de editar o borrar
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!selectedPet)
    return (
      <div className="flex justify-center items-center">
        <h2 className="text-3xl font-black text-center my-10">
          Todavía no haz agregado una mascota
        </h2>
      </div>
    );

  const {
    nombre,
    especie,
    raza,
    fecha_nacimiento,
    peso,
    sexo,
    color,
    estado_salud,
    foto_url,
    id,
  } = selectedPet;

  const { direccion = "", codigoPostal = "", provincia = "" } = location || {};
  const {
    direccion: userDireccion = "",
    codigoPostal: userCodigoPostal = "",
    provincia: userProvincia = "",
  } = ubicacion || {};

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    try {
      const { error } = await supabase.from("mascotas").delete().eq("id", id);
      if (error) throw error;

      setDeleteMessage("✅ Mascota borrada correctamente");
      refreshPets?.();
    } catch (err) {
      console.error(err);
      setDeleteMessage("❌ Error al borrar la mascota");
    } finally {
      setConfirmDelete(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-10 justify-center items-start w-full mb-10">
      {/* Imagen de la mascota */}
      <div className="w-60 h-80 bg-gray-200 rounded-2xl flex-shrink-0">
        <img
          src={foto_url || "/default-pet.png"}
          alt={nombre}
          className="w-full h-full object-cover rounded-2xl"
        />
      </div>

      {/* Información de la mascota */}
      <div className="flex flex-col gap-6 w-full md:w-2/3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DataRow label="Nombre" value={nombre} />
          <DataRow label="Especie" value={especie} />
          <DataRow label="Raza" value={raza} />
          <DataRow label="Fecha de Nacimiento" value={fecha_nacimiento} />
          <DataRow label="Sexo" value={sexo} />
          <DataRow label="Color" value={color} />
          <DataRow label="Estado de salud" value={estado_salud} />
          <DataRow label="Peso" value={`${peso} kg`} />
          <DataRow
            label="Ubicación dueño"
            value={`${userDireccion} ${userCodigoPostal} ${userProvincia}`}
          />
          <DataRow
            label="Última ubicación"
            value={`${direccion} ${codigoPostal} ${provincia}`}
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3 md:flex-row md:gap-5 mt-4">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-white border border-[#22687B] font-black py-2 px-4 rounded-xl hover:bg-[#22687B] hover:text-white transition"
          >
            Editar informes
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className={`w-full md:w-auto font-black py-2 px-4 rounded-xl ${
              confirmDelete
                ? "bg-red-600 text-white"
                : "bg-[#22687B] text-white hover:bg-[#1b5056] transition"
            }`}
          >
            {confirmDelete ? "Confirmar Borrar" : "Borrar Pet"}
          </button>

          <button
            type="button"
            className="w-full md:w-auto bg-[#FF8C09] text-white font-black py-2 px-4 rounded-xl hover:bg-[#e07e07] transition"
          >
            Informe Chip
          </button>
        </div>

        {deleteMessage && (
          <p
            className={`mt-2 text-center ${
              deleteMessage.includes("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {deleteMessage}
          </p>
        )}
      </div>

      {isModalOpen && (
        <EditPetModal
          pet={selectedPet}
          onClose={() => setIsModalOpen(false)}
          onSave={refreshPets}
        />
      )}
    </div>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="font-semibold text-[#22687B]">{label}</span>
      <span className="mt-1 text-gray-800">{value}</span>
    </div>
  );
}
