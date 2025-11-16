// src/pages/InformePet.jsx
import React, { useEffect, useState } from "react";
import PetCards from "../components/ui/PetsCard";
import MapsViewer from "../components/maps/MapsViewer";
import Maps from "../components/maps/Maps";
import EditPetForm from "../components/ui/EditPetForm";
import BtnViaje from "../components/ui/BtnViaje";
import BtnEmergency from "../components/ui/BtnEmergency";
import BtnPetMove from "../components/ui/BtnPetMove";
import ModalEditPet from "../components/modals/ModalEditPet";
import ModalViajeCard from "../components/modals/ModalViajeCard";
import { supabase } from "../services/supabase";
import { useSavedData } from "../context/SavedDataContext";

export default function InformePet() {
  const [mascotas, setMascotas] = useState([]);
  const { selectedPet, setSelectedPet } = useSavedData();

  const [location, setLocation] = useState(null);
  const [ubicacion, setUbicacion] = useState(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViajeModalOpen, setIsViajeModalOpen] = useState(false);

  // 🔹 Cargar mascotas, ubicacion y primera mascota seleccionada
useEffect(() => {
  const fetchPets = async () => {
    const { data: { user }} = await supabase.auth.getUser();
    if (!user) return;

    // 1️⃣ Traemos todas las mascotas
    const { data: mascotasData } = await supabase
      .from("mascotas")
      .select("*")
      .eq("owner_id", user.id);

    if (!mascotasData) {
      setMascotas([]);
      return;
    }

    // 2️⃣ Traemos TODAS las localizaciones
    const { data: localizacionesData } = await supabase
      .from("localizacion")
      .select("*")
      .in("mascota_id", mascotasData.map(m => m.id));

    // 3️⃣ Asociamos cada localizacion a su mascota
    const mascotasConUbicacion = mascotasData.map(m => {
      const loc = localizacionesData?.find(l => l.mascota_id === m.id);
      return {
        ...m,
        localizacion: loc || null
      };
    });

    setMascotas(mascotasConUbicacion);

    // 4️⃣ Seleccionamos pet inicial SIN romper nada
    if (mascotasConUbicacion.length > 0) {
      setSelectedPet(mascotasConUbicacion[0]);
    }

    // 5️⃣ Traemos ubicación del usuario
    const { data: ubicacioUser } = await supabase
      .from("localizacion_usuario")
      .select("*")
      .eq("owner_id", user.id);

    setUbicacion(ubicacioUser?.[0] || null);
  };

  fetchPets();
}, []);



  // 🔹 Manejo real de selección de mascota COMPLETA (no solo ID)
  const handleSelectPet = async (pet) => {
    if (!pet) return;

    // Guardamos la mascota COMPLETA
    setSelectedPet(pet);

    // Obtenemos su ubicación real
    const { data } = await supabase
      .from("localizacion")
      .select("*")
      .eq("mascota_id", pet.id)
      .maybeSingle();

    setLocation(data || null);
  };

  // 🔹 Eliminar mascota
  const handleDeletePet = async (pet) => {
    await supabase.from("mascotas").delete().eq("id", pet.id);

    setMascotas((prev) => prev.filter((m) => m.id !== pet.id));
    setSelectedPet(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-0">
      {/* PET CARDS + MAPA */}
      <section className="flex gap-20 mb-10">
        <PetCards
          pets={mascotas}
          selectedPet={selectedPet}
          setSelectedPet={handleSelectPet}
          onPetAdded={(newPet) => setMascotas((prev) => [...prev, newPet])}
        />

        <Maps selectedPet={selectedPet} location={location} />
      </section>

      <div className="bg-gray-300/50 w-full h-px my-10" />

      {/* INFORME - Edit info */}
      <section className="mb-5 mt-5">
        <EditPetForm
          pets={mascotas}
          selectedPet={selectedPet}
          location={location}
          ubicacion={ubicacion}
          setSelectedPet={handleSelectPet}
          onEditClick={() => setIsEditModalOpen(true)}
          onDeleteClick={() => setIsDeleteModalOpen(true)}
        />

        <MapsViewer selectedPet={selectedPet} location={location} />

        <div className="flex gap-10 justify-center items-center">
          <BtnViaje onClick={() => setIsViajeModalOpen(true)} />
          <BtnPetMove />
          <BtnEmergency />
        </div>
      </section>

      {/* Modal Editar */}
      {isEditModalOpen && (
       <ModalEditPet
  pet={selectedPet}
  onClose={() => setIsEditModalOpen(false)}
  onUpdated={(updatedPet) =>
    setMascotas((prev) =>
      prev.map((m) => (m.id === updatedPet.id ? updatedPet : m))
    )
  }
/>

      )}

      {/* Modal Eliminar */}
      {isDeleteModalOpen && (
        <ModalDeletePet
          pet={selectedPet}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => handleDeletePet(selectedPet)}
        />
      )}

      {/* Modal Viaje */}
      {isViajeModalOpen && (
        <ModalViajeCard onClose={() => setIsViajeModalOpen(false)} />
      )}
    </div>
  );
}
