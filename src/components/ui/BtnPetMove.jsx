import React from "react";
import { useNavigate } from "react-router-dom";
import { startRealTimeSimulation } from "../../services/MovimentPet.js";

export default function BtnPetMove({ pet, userLocation }) {
  const navigate = useNavigate();
  let stopSimulation = null;

  async function handleStartSim() {
    if (!pet || !userLocation) {
      console.error("🚫 Falta mascota o localización del usuario");
      return;
    }

    // Inicia simulación y guarda la función de stop
    stopSimulation = await startRealTimeSimulation(
      pet,
      userLocation,
      "normal",
      (alert) => {
        console.log("📡 ALERT:", alert);
      }
    );

    // Redirige inmediatamente al mapa
    navigate("/maps");
  }

  // Función opcional para detener desde este componente
  function handleStopSim() {
    if (stopSimulation) {
      stopSimulation();
      console.log("Simulación detenida");
    }
  }

  return (
    <div className="flex gap-2 justify-center h-[20px] text-center items-center">
      <button
        className="bg-[#22687b] rounded-xl py-1.5 px-8 font-bold text-white hover:bg-transparent hover:border hover:border-[#22687b] hover:text-black transition-all duration-300 w-full cursor-pointer "
        onClick={handleStartSim}
      >
        ¡Ubícame!
      </button>

     
    </div>
  );
}
