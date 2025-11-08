import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  getSelectedPetService,
  setSelectedPet as setSelectedPetService,
  subscribeSelectedPet
} from "../services/SelectedPet.js"

const SavedDataContext = createContext();

export function SavedDataProvider({ children }) {
  const [location, setLocation] = useState(null);

  const [selectedPet, setSelectedPetState] = useState(getSelectedPetService());

  const MASCOTA_ID = selectedPet?.id || null; // igual al del simulador

  // Mantego el service sincronizado
  useEffect(() => {
    const unsubscribe = subscribeSelectedPet((newPet) => {
      setSelectedPetState(newPet);
    })
    return unsubscribe;
  }, []);

  /*useEffect(() => {

    if(!MASCOTA_ID) return;

    async function fetchLocation() {
      const { data, error } = await supabase
        .from("localizacion")
        .select("lat, lng, direccion, updated_at")
        .eq("mascota_id", MASCOTA_ID)
        .single();

      if (error) {
        console.error("❌ Error al obtener localización:", error.message);
      } else {
        setLocation(data);
      }
    }

    fetchLocation();

    // Polling cada 5 segundos
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [MASCOTA_ID]); */

  // 🔹 Atualiza context → service
  const setSelectedPet = (pet) => {
    setSelectedPetState(pet);
    setSelectedPetService(pet); // mantém tudo sincronizado
  };

  return (
    <SavedDataContext.Provider value={{ location, selectedPet, setSelectedPet }}>
      {children}
    </SavedDataContext.Provider>
  );
}

export function useSavedData() {
  return useContext(SavedDataContext);
}
