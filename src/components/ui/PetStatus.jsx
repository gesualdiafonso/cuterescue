// src/components/ui/PetStatus.jsx
import React from "react";

export default function PetStatus({ activo }) {
  const statusText = activo ? "Activo" : "Inactivo";
  const bgColor = activo ? "bg-green-500" : "bg-red-500";

  return (
    <div className={`text-white w-20 h-7 flex justify-center items-center font-semibold px-3 rounded-lg ${bgColor}`}>
      {statusText}
    </div>
  );
}
