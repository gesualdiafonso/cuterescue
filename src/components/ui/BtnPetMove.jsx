import React from "react";
import { useNavigate } from "react-router-dom";
import { startRealTimeSimulation } from "../../services/MovimentPet.js";

export default function BtnPetMove({ pet, userLocation }) {
  const navigate = useNavigate();

  async function handleStartSim() {
    if (!pet || !userLocation) {
      console.error("🚫 Falta mascota o localización del usuario");
      return;
    }

    // Inicia simulación
    const stop = await startRealTimeSimulation(pet, userLocation, "normal", (alert) => {
      console.log("📡 ALERT:", alert);
    });

    // Redireciona imediatamente para el mapa 
    navigate("/maps");

    // Simula nuevamente despues de 1min
    setTimeout(() => {
      stop();
      console.log("Simulación finalizada");
    }, 60000);
  }

  return (
    <button
      className="bg-[#22687b] rounded-xl py-2 px-8 font-bold text-white hover:bg-transparent hover:border hover:border-[#22687b] hover:text-black transition-all duration-300"
      onClick={handleStartSim}
    >
      Pet en Movimiento
    </button>
  );
}
