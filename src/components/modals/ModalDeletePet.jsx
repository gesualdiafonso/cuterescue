import React, { useState } from "react";

export default function ModalDeletePet({ pet, onClose, onDelete }) {
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = () => {
    if (confirmText === pet.nombre) {
      onDelete(pet);
      onClose();
    } else {
      alert("El nombre no coincide. Intenta de nuevo.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500/80 flex items-center justify-center z-50">
      <div className="bg-white p-10 rounded-2xl w-[400px] shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-black">Confirmar borrado</h2>
        <p className="mb-4 text-black">
          Escribe el nombre del pet <strong>{pet.nombre}</strong> para confirmar el borrado.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full border border-gray-300 p-2 mb-6"
        />
        <div className="flex gap-5 justify-end">
          <button onClick={onClose} className="bg-gray-300 px-5 py-2 rounded-xl">
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={confirmText !== pet.nombre}
            className={`px-5 py-2 rounded-xl ${
              confirmText === pet.nombre
                ? "bg-red-500 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
