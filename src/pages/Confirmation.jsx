import React from "react";
import ProcesoRegistro from "../components/ProcesoRegistro";

export default function Confirmacion() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4">
          <ProcesoRegistro currentStep={3} />
        </div>

        <div className="md:w-3/4 flex items-center justify-center">
          <h1 className="text-lg md:text-xl text-center font-medium">
            Revisa tu casilla de email para confirmar
          </h1>
        </div>
      </div>
    </div>
  );
}
