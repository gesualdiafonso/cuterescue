import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const SavedDataContext = createContext();

export function SavedDataProvider({ children }) {
  const [location, setLocation] = useState(null);
  const MASCOTA_ID = "dd1e7afc-c65c-4914-bde2-247b01ba0a85"; // igual al del simulador

  useEffect(() => {
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
  }, []);

  return (
    <SavedDataContext.Provider value={{ location }}>
      {children}
    </SavedDataContext.Provider>
  );
}

export function useSavedData() {
  return useContext(SavedDataContext);
}
