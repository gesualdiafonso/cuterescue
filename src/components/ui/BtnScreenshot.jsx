import React from "react";

const BtnScreenshot = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition"
    >
      Enviar captura
    </button>
  );
};

export default BtnScreenshot;
