import React from "react";
import { startRealTimeSimulation } from "../../services/MovimentPet.js";
import { useSavedData } from "../../context/SavedDataContext";

export default function BtnEmergency() {
  const { selectedPet, location, setAlert, simStopRef, setSimulationRunning } =
    useSavedData();

  async function handleClick() {
    if (!selectedPet || !location) return;

    console.log("🚨 Emergencia activada:", selectedPet.id);

    setAlert({ variant: "activate" });

    const stopFn = await startRealTimeSimulation(
      selectedPet,
      location,
      "emergency",
      null
    );

    // Guardamos stopFn en contexto
    simStopRef.current = stopFn;
    setSimulationRunning(true);
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
