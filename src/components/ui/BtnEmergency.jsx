import { simulateEmergency } from "../../services/MovimentPet.js";
import { useSavedData } from "../../context/SavedDataContext";

export default function BtnEmergency() {
  const { selectedPet, location, setAlert } = useSavedData();

  async function handleClick() {
    if (!selectedPet || !location) {
<<<<<<< HEAD
    console.log("Error: Faltan datos:", { selectedPet, location });
    return;
  }
  console.log("Simulación: Emergencia disparada:", selectedPet.id);
  await simulateEmergency(selectedPet, location, setAlert);
  console.log("Correct: Simulación completa");
=======
      console.log("❌ Faltan datos:", { selectedPet, location });
      return;
    }

    console.log("🚨 Emergencia activada:", selectedPet.id);

   

    await simulateEmergency(selectedPet, location, setAlert);
>>>>>>> 6a12757 (estado de emergencia hacia maps)
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
