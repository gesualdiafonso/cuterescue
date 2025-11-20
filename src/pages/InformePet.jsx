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

/**
 * @description
 * pag de informe y gestión avanzada de una mascota selec
 *
 * Este componente:
 * - muestra todas las tarjetas de mascotas del usuari
 * - muestra un mapa con la ubicacion actual de la mascota seleccionada
 * - permite editar la info de la mascota
 * - permite eliminar, actualizar o agregar nuevas mascotas
 * - Integra botones clave (viaje, emergencia, simulación GPS)
 * - Visualiza alertas globales provenientes del context.
 *
 * Combina info de estos componentes:
 * - PetCards
 * - Maps (localizacion actual)
 * - MapsViewer (vista extendida)
 * - EditPetForm 
 * - BtnViaje, BtnEmergency, BtnPetMove
 * - ModalAlert,, ModalViajeCard
 *
 */

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

      {/* PET CARDS + MAPA */}
      <section className="flex flex-col lg:flex-row gap-10 mb-10 items-center">
        <PetCards
          pets={mascotas}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          onPetAdded={handlePetAdded}    
          onPetDeleted={handlePetDeleted} 
          refreshPets={refreshPets}
        />

        <Maps selectedPet={selectedPet} location={location} />
      </section>

      <div className="bg-gray-300/50 w-full h-px my-10" />

      {/*  INFORME / EDICIÓN */}
      <section className="mb-5 mt-5">

        <EditPetForm
          selectedPet={selectedPet}
          location={location}
          ubicacion={ubicacionUsuario}
          refreshPets={refreshPets}
          onPetDeleted={handlePetDeleted}
          onPetUpdated={handlePetUpdated}   
        />

        <MapsViewer selectedPet={selectedPet} location={location} />

        {/* BOTONES ACCIoN */}
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
