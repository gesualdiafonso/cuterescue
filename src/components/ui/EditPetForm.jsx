<<<<<<< HEAD
import React from "react";

export default function EditPetForm({ selectedPet, onEditClick, onDeleteClick, location, ubicacion  }) {
  if (!selectedPet) return <div className="felx justify-center items-center"><h2 className="text-3xl font-black text-center my-10">Todavía el Pet no ha sido agregado</h2></div>;

  const { nombre, especie, raza, fecha_nacimiento, peso, sexo, color, estado_salud, foto_url } = selectedPet;

  const { direccion = "", codigoPostal = "", provincia = "" } = location || {};
  const { direccion: userDireccion = "", codigoPostal: userCodigoPostal = "", provincia: userProvincia = "" } = ubicacion || {};
=======
import React, { useState } from "react";
import EditPetModal from "../modals/EditPetModal";
import { supabase } from "../../services/supabase";

export default function EditPetForm({
  selectedPet,
  location,
  ubicacion,
  refreshPets, // callback para actualizar la lista después de editar o borrar
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(""); // mensaje para feedback
  const [confirmDelete, setConfirmDelete] = useState(false); // para confirmar borrado

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
      setConfirmDelete(true); // primer click activa confirmación
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
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)

  return (
    <div className="flex gap-20 justify-center items-center w-full mb-10">
      <div className="w-60 h-80 bg-gray-200 rounded-2xl">
<<<<<<< HEAD
        <img src={foto_url} alt={nombre} className="w-full h-full object-cover" />
=======
        <img
          src={foto_url || "/default-pet.png"}
          alt={nombre}
          className="w-full h-full object-cover rounded-2xl"
        />
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)
      </div>

      <form className="flex flex-col gap-10 w-2/3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mb-10">
<<<<<<< HEAD
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
            <label className="font-light text-lg text-black">Peso</label>
            <input
              type="text"
              value={peso}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <label className="font-light text-lg text-black">Ubicación dueno:</label>
            <input
              type="text"
              value={userDireccion + " " + userCodigoPostal + " " + userProvincia}
              disabled
              className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
            />
          </div>

            <div className="flex flex-col">
              <label className="font-light text-lg text-black">Última ubicación:</label>
              <input
                type="text"
                value={`${direccion} ${codigoPostal} ${provincia}`}
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
=======
          <Input label="Nombre" value={nombre} />
          <Input label="Especie" value={especie} />
          <Input label="Raza" value={raza} />
          <Input label="Fecha de Nacimiento" value={fecha_nacimiento} />
          <Input label="Sexo" value={sexo} />
          <Input label="Color" value={color} />
          <Input label="Estado de salud" value={estado_salud} />
          <Input label="Peso" value={peso + " kg"} />
          <Input
            label="Ubicación dueño"
            value={`${userDireccion} ${userCodigoPostal} ${userProvincia}`}
          />
          <Input
            label="Última ubicación"
            value={`${direccion} ${codigoPostal} ${provincia}`}
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-5">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white border border-[#22687c] font-black py-2 rounded-xl"
            >
              Editar informes
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className={`w-full font-black py-2 rounded-xl ${
                confirmDelete
                  ? "bg-red-600 text-white"
                  : "bg-[#22687c] text-white"
              }`}
            >
              {confirmDelete ? "Confirmar Borrar" : "Borrar Pet"}
            </button>

            <button
              type="button"
              className="w-full bg-[#fbc68f] text-white font-black py-2 rounded-xl"
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
      </form>

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

function Input({ label, value }) {
  return (
    <div className="flex flex-col">
      <label className="font-light text-lg text-black">{label}</label>
      <input
        type="text"
        value={value}
        disabled
        className="border border-[#22687c] p-2 mt-2 bg-gray-100 text-gray-700"
      />
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)
    </div>
  );
}
