import { useSavedData } from "../../context/SavedDataContext";

export default function BtnPetFound() {
  const { stopSimulation } = useSavedData();

  return (
    <button
      onClick={stopSimulation}
      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition"
    >
      ¡Encontré a mi mascota!
    </button>
  );
}
