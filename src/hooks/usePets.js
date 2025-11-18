import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useSavedData } from "../context/SavedDataContext";
import { clearSelectedPet } from "../services/SelectedPet";

export default function usePets() {
  const { selectedPet, setSelectedPet } = useSavedData();

  const [mascotas, setMascotas] = useState([]);
  const [location, setLocation] = useState(null);
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);

  // ⬇️ CARGA inicial de mascotas + cleanup de selectedPet si no hay
  useEffect(() => {
    const fetchPets = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Mascotas del usuario
      const { data: mascotasData } = await supabase
        .from("mascotas")
        .select("*")
        .eq("owner_id", user.id);

      if (!mascotasData || mascotasData.length === 0) {
        setMascotas([]);
        clearSelectedPet();               // 🧹 LIMPIAR selección cuando NO hay mascotas
        setLocation(null);
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

      // Si no hay mascota seleccionada → seleccionar la primera disponible
      if (!selectedPet) {
        const primera = mascotasConUbicacion[0];
        setSelectedPet(primera);
        setLocation(primera.localizacion || null);
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
  }, []); // 👉 importante: NO depender de selectedPet (previene loops)


  // ⬇️ Seleccionar mascota manualmente
  const handleSelectPet = async (pet) => {
    if (!pet) {
      clearSelectedPet();
      setLocation(null);
      return;
    }

    setSelectedPet(pet);

    const { data } = await supabase
      .from("localizacion")
      .select("*")
      .eq("mascota_id", pet.id)
      .maybeSingle();

    setLocation(data || null);
  };


  // ⬇️ Eliminar mascota → limpia selectedPet si corresponde
  const handleDeletePet = async (pet) => {
    const { error } = await supabase
      .from("mascotas")
      .delete()
      .eq("id", pet.id);

    if (error) return;

    // Actualizar lista local
    setMascotas(prev => {
      const nuevas = prev.filter(m => m.id !== pet.id);

      // Si quedó SIN mascotas → limpiar selección
      if (nuevas.length === 0) {
        clearSelectedPet();
        setLocation(null);
      }

      return nuevas;
    });

    // Si se eliminó la mascota seleccionada → limpiar selección
    if (selectedPet?.id === pet.id) {
      clearSelectedPet();
      setLocation(null);
    }
  };


  // ⬇️ Agregar o actualizar mascota
  const handleSavePet = async (pet, file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let fotoUrl = pet.foto_url || "";

    // Subir imagen si corresponde
    if (file) {
      const fileName = `${user.id}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("mascotas")
        .upload(fileName, file);

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage
          .from("mascotas")
          .getPublicUrl(fileName);
        fotoUrl = publicUrl.publicUrl;
      }
    }

    if (pet.id) {
      // ACTUALIZAR mascota existente
      const { data: updated } = await supabase
        .from("mascotas")
        .update({ ...pet, foto_url: fotoUrl })
        .eq("id", pet.id)
        .select()
        .single();

      setMascotas(prev =>
        prev.map(m => (m.id === pet.id ? { ...m, ...updated } : m))
      );

    } else {
      // AGREGAR mascota nueva
      const { data: inserted } = await supabase
        .from("mascotas")
        .insert([{ ...pet, owner_id: user.id, foto_url: fotoUrl }])
        .select()
        .single();

      // Agregar a lista
      setMascotas(prev => [...prev, inserted]);

      // Seleccionar automáticamente
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
