import React, { useState } from "react";
import PetCards from "../components/ui/PetsCard";
import MapsViewer from "../components/maps/MapsViewer";
import Maps from "../components/maps/Maps";
import EditPetForm from "../components/ui/EditPetForm";
import ModalAlert from "../components/modals/ModalAlert";
import { useSavedData } from "../context/SavedDataContext";

import BtnViaje from "../components/ui/BtnViaje";
import BtnEmergency from "../components/ui/BtnEmergency";
import BtnPetMove from "../components/ui/BtnPetMove";

import ModalViajeCard from "../components/modals/ModalViajeCard";

import usePets from "../hooks/usePets";

export default function InformePet() {
  const {
    mascotas,
    location,
    ubicacionUsuario,
    selectedPet,
    setSelectedPet,
    refreshPets,     
    handleDeletePet,
  } = usePets();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViajeModalOpen, setIsViajeModalOpen] = useState(false);

  const { showAlert, alert, closeAlert } = useSavedData();
  // Cuando se agrega una mascota
  const handlePetAdded = async (newPet) => {
    await refreshPets();
    if (newPet) setSelectedPet(newPet);
  };

  //  Cuando se elimina una mascota desde EditPetForm o modal
  const handlePetDeleted = async () => {
    await refreshPets();

    const petStillExists = mascotas.some((m) => m.id === selectedPet?.id);
    if (!petStillExists) setSelectedPet(null);
  };

  //  Cuando se edita una mascota (nombre, foto, etc.)
  const handlePetUpdated = async (updatedPet) => {
    await refreshPets();
    setSelectedPet(updatedPet);
  };

  return (
    <div className="max-w-7xl mx-auto p-0 mt-5">

      {/* 🐶 PET CARDS + MAPA */}
      <section className="flex flex-col lg:flex-row gap-10 mb-10 items-center">
        <PetCards
          pets={mascotas}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          onPetAdded={handlePetAdded}     // REAL-TIME ADD
          onPetDeleted={handlePetDeleted} // REAL-TIME DELETE
          refreshPets={refreshPets}
        />

        <Maps selectedPet={selectedPet} location={location} />
      </section>

      <div className="bg-gray-300/50 w-full h-px my-10" />

      {/* 📄 INFORME / EDICIÓN */}
      <section className="mb-5 mt-5">

        <EditPetForm
          selectedPet={selectedPet}
          location={location}
          ubicacion={ubicacionUsuario}
          refreshPets={refreshPets}
          onPetDeleted={handlePetDeleted}      //  REAL-TIME DELETE
          onPetUpdated={handlePetUpdated}      //  REAL-TIME UPDATE
        />

        <MapsViewer selectedPet={selectedPet} location={location} />

        {/* BOTONES ACCIÓN */}
        <div className="flex gap-10 justify-center items-center">
          <BtnViaje onClick={() => setIsViajeModalOpen(true)} />
          <BtnPetMove pet={selectedPet} userLocation={ubicacionUsuario} />

          <BtnEmergency />

        </div>
      </section>
 <ModalAlert 
        show={showAlert}
        alert={alert}
        onClose={closeAlert}
      />
  

      {/*  Modal Viaje */}
      {isViajeModalOpen && (
        <ModalViajeCard onClose={() => setIsViajeModalOpen(false)} />
      )}

    </div>
  );
}
