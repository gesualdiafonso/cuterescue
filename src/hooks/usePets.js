import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useSavedData } from "../context/SavedDataContext";

export default function usePets() {
  const { selectedPet, setSelectedPet } = useSavedData();

  const [mascotas, setMascotas] = useState([]);
  const [location, setLocation] = useState(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);

  // 🔁 Carga inicial de mascotas + ubicación usuario
  const refreshPets = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMascotas([]);
      setLocation(null);
      setUbicacionUsuario(null);
      return;
    }

    // 🐾 Mascotas del usuario
    const { data: mascotasData, error: petsError } = await supabase
      .from("mascotas")
      .select("*")
      .eq("owner_id", user.id);

    if (petsError) {
      console.error("Error cargando mascotas:", petsError);
      setMascotas([]);
    }

    // Localizaciones de esas mascotas
    let mascotasConUbicacion = [];
    if (mascotasData && mascotasData.length > 0) {
      const { data: localizacionesData, error: locError } = await supabase
        .from("localizacion")
        .select("*")
        .in(
          "mascota_id",
          mascotasData.map((m) => m.id)
        );

      if (locError) {
        console.error("Error cargando localizaciones:", locError);
      }

      mascotasConUbicacion = mascotasData.map((m) => {
        const loc = localizacionesData?.find((l) => l.mascota_id === m.id);
        return { ...m, localizacion: loc || null };
      });
    }

    setMascotas(mascotasConUbicacion);

    // 📍 Ubicación del usuario
    const { data: ubicacionData, error: ubicError } = await supabase
      .from("localizacion_usuario")
      .select("*")
      .eq("owner_id", user.id)
      .single();

    if (ubicError) {
      console.error("Error cargando localizacion_usuario:", ubicError);
    }
    setUbicacionUsuario(ubicacionData || null);

    // 🎯 Manejo de selectedPet y location
    if (mascotasConUbicacion.length === 0) {
      // No hay mascotas
      setLocation(null);
      setSelectedPet(null);
      return;
    }

    // Si no hay selectedPet, seleccionamos la primera
    if (!selectedPet) {
      const firstPet = mascotasConUbicacion[0];
      setSelectedPet(firstPet);
      setLocation(firstPet.localizacion || null);
      return;
    }

    // Si había selectedPet, tratamos de mantenerla
    const stillExists = mascotasConUbicacion.find(
      (m) => m.id === selectedPet.id
    );

    if (stillExists) {
      setLocation(stillExists.localizacion || null);
    } else {
      // La mascota seleccionada ya no existe (por ejemplo, se borró)
      setSelectedPet(null);
      setLocation(null);
    }
  };

  useEffect(() => {
    refreshPets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo una vez al montar

  // 👉 seleccionar mascota desde UI
  const handleSelectPet = async (pet) => {
    if (!pet) return;
    setSelectedPet(pet);

    const { data, error } = await supabase
      .from("localizacion")
      .select("*")
      .eq("mascota_id", pet.id)
      .maybeSingle();

    if (error) {
      console.error("Error obteniendo localizacion de mascota:", error);
    }

    setLocation(data || null);
  };

  // 👉 eliminar mascota
const handleDeletePet = async (pet) => {
  const { error } = await supabase.from("mascotas").delete().eq("id", pet.id);
  if (!error) {
    setMascotas(prev => prev.filter(m => m.id !== pet.id));
    setSelectedPet(null);
  }
};


  // 👉 agregar / actualizar mascota desde un formulario que use este hook
  const handleSavePet = async (pet, file) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    let fotoUrl = pet.foto_url || "";

    if (file) {
      const fileName = `${user.id}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("mascotas")
        .upload(fileName, file);

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrl } = supabase.storage
        .from("mascotas")
        .getPublicUrl(fileName);
      fotoUrl = publicUrl.publicUrl;
    }

    if (pet.id) {
      // 🔁 Actualizar
      const { error } = await supabase
        .from("mascotas")
        .update({ ...pet, foto_url: fotoUrl })
        .eq("id", pet.id);

      if (error) {
        console.error("Error actualizando mascota:", error);
        return;
      }
    } else {
      // 🆕 Agregar
      const { data: inserted, error } = await supabase
        .from("mascotas")
        .insert([{ ...pet, owner_id: user.id, foto_url: fotoUrl }])
        .select()
        .single();

      if (error) {
        console.error("Error insertando mascota:", error);
        return;
      }

      // dejamos al hook decidir cómo manejar selectedPet
      setSelectedPet(inserted);
    }

    await refreshPets();
  };

  return {
    mascotas,
    location,
    ubicacionUsuario,
    selectedPet,
    setSelectedPet: handleSelectPet,
    handleDeletePet,
    handleSavePet,
    refreshPets, // 👈 clave para AddPets / EditPetForm
  };
}
