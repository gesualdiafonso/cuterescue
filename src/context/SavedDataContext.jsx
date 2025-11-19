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

  //  referencia a stopSimulation()
  const simStopRef = useRef(null);

  const [simulationRunning, setSimulationRunning] = useState(false);

  const realtimeChannelRef = useRef(null);

  // Cargar mascota seleccionada
  useEffect(() => {
    const saved = getSelectedPetService();
    if (saved) setSelectedPetState(saved);
  }, []);

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

  //  Realtime
  useEffect(() => {
    if (!selectedPet) return;

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

  const setSelectedPet = (pet) => {
    setSelectedPetState(pet);
    setSelectedPetService(pet);
  };

  // Cuando entra una alerta → iniciar UI
  useEffect(() => {
    if (alert) {
      setShowAlert(true);
      setAlertOn(true);
    }
  }, [alert]);

  const closeAlert = () => setShowAlert(false);

  //  *STOP simulacion !! *
  const stopSimulation = () => {
    console.log("simulacion en stop");

    setSimulationRunning(false);
    setAlertOn(false);
    setShowAlert(false);

    //  detener intervalo real
    if (simStopRef.current) {
      simStopRef.current();
      simStopRef.current = null;
    }

    //  cortar realtime
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

        // estado simulación
        simulationRunning,
        setSimulationRunning,

        // manejar intervalos
        simStopRef,

        // detener simulación completa
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
