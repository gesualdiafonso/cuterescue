// src/hooks/usePets.js
import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useSavedData } from "../context/SavedDataContext";

export default function usePets() {
  const { selectedPet, setSelectedPet } = useSavedData();

  const [mascotas, setMascotas] = useState([]);
  const [location, setLocation] = useState(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);

  // Carga inicial de mascotas y usuario
  useEffect(() => {
    const fetchPets = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mascotas del usuario
      const { data: mascotasData } = await supabase
        .from("mascotas")
        .select("*")
        .eq("owner_id", user.id);

      if (!mascotasData) {
        setMascotas([]);
        return;
      }

      // Localizaciones de mascotas
      const { data: localizacionesData } = await supabase
        .from("localizacion")
        .select("*")
        .in("mascota_id", mascotasData.map(m => m.id));

      const mascotasConUbicacion = mascotasData.map(m => {
        const loc = localizacionesData?.find(l => l.mascota_id === m.id);
        return { ...m, localizacion: loc || null };
      });

      setMascotas(mascotasConUbicacion);

      // Seleccionar primera mascota si no hay
      if (mascotasConUbicacion.length > 0 && !selectedPet) {
        setSelectedPet(mascotasConUbicacion[0]);
        setLocation(mascotasConUbicacion[0].localizacion || null);
      }

      // Ubicación del usuario
      const { data: ubicacionData } = await supabase
        .from("localizacion_usuario")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      setUbicacionUsuario(ubicacionData || null);
    };

    fetchPets();
  }, [selectedPet, setSelectedPet]);

  // Seleccionar mascota
  const handleSelectPet = async (pet) => {
    if (!pet) return;
    setSelectedPet(pet);

    const { data } = await supabase
      .from("localizacion")
      .select("*")
      .eq("mascota_id", pet.id)
      .maybeSingle();

    setLocation(data || null);
  };

  // Eliminar mascota
  const handleDeletePet = async (pet) => {
    const { error } = await supabase.from("mascotas").delete().eq("id", pet.id);
    if (!error) {
      setMascotas(prev => prev.filter(m => m.id !== pet.id));
      setSelectedPet(null);
    }
  };

  // Agregar o actualizar mascota
  const handleSavePet = async (pet, file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let fotoUrl = pet.foto_url || "";

    if (file) {
      const fileName = `${user.id}_${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("mascotas")
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrl } = supabase.storage.from("mascotas").getPublicUrl(fileName);
      fotoUrl = publicUrl.publicUrl;
    }

    if (pet.id) {
      // Actualizar
      const { error } = await supabase
        .from("mascotas")
        .update({ ...pet, foto_url: fotoUrl })
        .eq("id", pet.id);
      if (!error) {
        setMascotas(prev => prev.map(m => (m.id === pet.id ? { ...m, ...pet, foto_url: fotoUrl } : m)));
      }
    } else {
      // Agregar
      const { data: inserted } = await supabase
        .from("mascotas")
        .insert([{ ...pet, owner_id: user.id, foto_url: fotoUrl }])
        .select()
        .single();
      setMascotas(prev => [...prev, inserted]);
      setSelectedPet(inserted);
    }
  };

  return {
    mascotas,
    location,
    ubicacionUsuario,
    selectedPet,
    setSelectedPet: handleSelectPet,
    handleDeletePet,
    handleSavePet,
  };
}
