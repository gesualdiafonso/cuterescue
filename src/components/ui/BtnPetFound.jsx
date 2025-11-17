// src/components/ui/BtnPetFound.jsx
import React from "react";

const BtnPetFound = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
    >
      ¡Encontré a mi mascota!
    </button>
  );
};

export default BtnPetFound;