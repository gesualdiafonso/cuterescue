import React, { createContext, useContext, useEffect, useState, useRef } from "react";
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
  const [alertOn, setAlertOn] = useState(false);

  const [simulationRunning, setSimulationRunning] = useState(false);

  // 🆕 Guardamos el canal realtime
  const realtimeChannelRef = useRef(null);

  // Cargar mascota seleccionada
  useEffect(() => {
    const saved = getSelectedPetService();
    if (saved) setSelectedPetState(saved);
  }, []);

  // Escuchar cambios del pet
  useEffect(() => {
    const unsubscribe = subscribeSelectedPet(setSelectedPetState);
    return unsubscribe;
  }, []);

  const MASCOTA_ID = selectedPet?.id ?? null;

  // Obtener ubicación inicial
  useEffect(() => {
    if (!MASCOTA_ID) return;

    async function loadLocation() {
      const { data } = await supabase
        .from("localizacion")
        .select("*")
        .eq("mascota_id", MASCOTA_ID)
        .single();

      if (data) setLocation(data);
    }
    loadLocation();
  }, [MASCOTA_ID]);

  // Suscripción realtime
  useEffect(() => {
    if (!selectedPet) return;

    // Si ya había un canal, lo eliminamos
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
    }

    const channel = supabase
      .channel(`realtime-location-${selectedPet.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "localizacion",
          filter: `mascota_id=eq.${selectedPet.id}`,
        },
        (payload) => {
          console.log("🔄 Realtime → Nueva ubicación:", payload.new);
          if (simulationRunning) {
            setLocation(payload.new);
          }
        }
      )
      .subscribe();

    realtimeChannelRef.current = channel;

    return () => supabase.removeChannel(channel);
  }, [selectedPet, simulationRunning]);

  // Guardar selected pet en storage
  const setSelectedPet = (pet) => {
    setSelectedPetState(pet);
    setSelectedPetService(pet);
  };

  // Mostrar alerta → activa simulación
  useEffect(() => {
    if (alert) {
      setShowAlert(true);
      setSimulationRunning(true);
      setAlertOn(true);
    }
  }, [alert]);

  const closeAlert = () => setShowAlert(false);

  // 🛑 Detener simulación REAL
  const stopSimulation = () => {
    console.log("🛑 Simulación detenida correctamente");

    setSimulationRunning(false);
    setAlertOn(false);
    setShowAlert(false);

    // Cortamos el canal realtime DEFINITIVAMENTE
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }
  };

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
        alert,
        simulationRunning,
        stopSimulation,
      }}
    >
      {children}
    </SavedDataContext.Provider>
  );
}

export function useSavedData() {
  return useContext(SavedDataContext);
}