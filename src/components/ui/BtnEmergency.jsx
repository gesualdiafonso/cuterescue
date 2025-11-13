import { simulateEmergency } from "../../services/MovimentPet.js";
import { useSavedData } from "../../context/SavedDataContext";

export default function BtnEmergency() {
  const { selectedPet, location, setAlert, setNavbarColor } = useSavedData();

  async function handleClick() {
    if (!selectedPet || !location) {
      console.log("❌ Faltan datos:", { selectedPet, location });
      return;
    }

    console.log("🚨 Emergencia activada:", selectedPet.id);

    //  cambia el color del navbar
    setNavbarColor("#FBC68F");

    await simulateEmergency(selectedPet, location, setAlert);
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
