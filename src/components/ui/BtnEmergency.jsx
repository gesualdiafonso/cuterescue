import React from "react";
import { startRealTimeSimulation } from "../../services/MovimentPet.js";
import { useSavedData } from "../../context/SavedDataContext";

export default function BtnEmergency() {
  const { selectedPet, location, setAlert } = useSavedData();

  async function handleClick() {
    if (!selectedPet || !location) {
      console.log("❌ Faltan datos:", { selectedPet, location });
      return;
    }

    console.log("🚨 Emergencia activada:", selectedPet.id);

    // Mostrar modal + activar simulación automáticamente en el context
    setAlert({
      title: "Emergencia activada",
      message: "Tu mascota está siendo rastreada.",
      color: "#FBC68F",
      button: "Seguir mirando",
      redirect: "/maps",
    });

    // Iniciar simulación real
    await startRealTimeSimulation(selectedPet, location, "emergency");
  }

  return (
    <button
      onClick={handleClick}
      className="bg-[#fd9b08] rounded-xl py-2 px-8 font-bold text-white hover:bg-[#ff4e0d] transition-all duration-300"
    >
      Emergencias
    </button>
  );
}
