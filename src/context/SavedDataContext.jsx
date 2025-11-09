// ✅ SavedDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  getSelectedPetService,
  setSelectedPet as setSelectedPetService,
  subscribeSelectedPet
} from "../services/SelectedPet";

const SavedDataContext = createContext();

export function SavedDataProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [selectedPet, setSelectedPetState] = useState(null);

  // 🧩 Etapa 1: Carrega imediatamente o pet salvo no localStorage
  useEffect(() => {
    const saved = getSelectedPetService();
    if (saved) {
      setSelectedPetState(saved);
    }
  }, []);

  // 🧩 Etapa 2: Subscreve às mudanças do service
  useEffect(() => {
    const unsubscribe = subscribeSelectedPet((newPet) => {
      setSelectedPetState(newPet);
    });
    return unsubscribe;
  }, []);

  const MASCOTA_ID = selectedPet?.id || null;

  // 🧩 Etapa 3: Atualiza a localização do pet ativo
  useEffect(() => {
    if (!MASCOTA_ID) return;

    async function fetchLocation() {
      const { data, error } = await supabase
        .from("localizacion")
        .select("lat, lng, direccion, updated_at")
        .eq("mascota_id", MASCOTA_ID)
        .single();

      if (!error) setLocation(data);
      else console.error("❌ Error al obtener localización:", error.message);
    }

    fetchLocation();
    const interval = setInterval(fetchLocation, 5000);
    return () => clearInterval(interval);
  }, [MASCOTA_ID]);

  // 🧩 Etapa 4: Sincroniza bidirecionalmente
  const setSelectedPet = (pet) => {
    setSelectedPetState(pet);
    setSelectedPetService(pet);
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
