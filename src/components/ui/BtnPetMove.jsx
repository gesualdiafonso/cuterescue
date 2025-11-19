import React from "react";
import { useNavigate } from "react-router-dom";
import { startRealTimeSimulation } from "../../services/MovimentPet.js";
import { useSavedData } from "../../context/SavedDataContext";

export default function BtnPetMove({ pet, userLocation }) {
  const navigate = useNavigate();
  const { simStopRef, setSimulationRunning } = useSavedData();

  async function handleStartSim() {
    if (!pet || !userLocation) return;

    const stopFn = await startRealTimeSimulation(
      pet,
      userLocation,
      "normal",
      null
    );

    simStopRef.current = stopFn;
    setSimulationRunning(true);

    navigate("/maps");
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
