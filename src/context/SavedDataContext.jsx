// ✅ SavedDataContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import {
  getSelectedPetService,
  setSelectedPet as setSelectedPetService,
  subscribeSelectedPet,
} from "../services/SelectedPet";

const SavedDataContext = createContext();

export function SavedDataProvider({ children }) {
  const [location, setLocation] = useState(null);
  const [selectedPet, setSelectedPetState] = useState(null);

  const [alert, setAlert] = useState(null);
  const [showAlert, setShowAlert] = useState(false);


  // estado de emergencia (ON/OFF)
const [alertOn, setAlertOn] = useState(false);


  // 🧩 Etapa 1: Carga inmediata del pet guardado
  useEffect(() => {
    const saved = getSelectedPetService();
    if (saved) {
      setSelectedPetState(saved);
    }
  }, []);

  // 🧩 Etapa 2: Suscripción a cambios del service
  useEffect(() => {
    const unsubscribe = subscribeSelectedPet((newPet) => {
      setSelectedPetState(newPet);
    });
    return unsubscribe;
  }, []);

  const MASCOTA_ID = selectedPet?.id || null;

  // 🧩 Etapa 3: Actualiza ubicación del pet activo
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

  // 🧩 Etapa 4: Sincronización bidireccional
  const setSelectedPet = (pet) => {
    setSelectedPetState(pet);
    setSelectedPetService(pet);
  };

  // 🧩 Mostrar alertas
  useEffect(() => {
    if (alert) setShowAlert(true);
  }, [alert]);

  function closeAlert() {
    setShowAlert(false);
  }

  

  return (
    <SavedDataContext.Provider
      value={{
        location,
        selectedPet,
        setSelectedPet,
        showAlert,
        closeAlert,
        setAlert,
alertOn,
setAlertOn,

      }}
    >
      {children}
    </SavedDataContext.Provider>
  );
}

export function useSavedData() {
  return useContext(SavedDataContext);
}
