import React, { useState } from "react";
import PetCards from "../components/ui/PetsCard";
import MapsViewer from "../components/maps/MapsViewer";
import Maps from "../components/maps/Maps";
import EditPetForm from "../components/ui/EditPetForm";
import BtnViaje from "../components/ui/BtnViaje";
import BtnEmergency from "../components/ui/BtnEmergency";
import BtnPetMove from "../components/ui/BtnPetMove";
import ModalEditPet from "../components/modals/ModalEditPet";
import ModalViajeCard from "../components/modals/ModalViajeCard";
import usePets from "../hooks/usePets";

export default function InformePet() {
  const {
    mascotas,
    location,
    ubicacionUsuario,
    selectedPet,
    setSelectedPet,
    handleDeletePet,
    handleSavePet,
  } = usePets();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViajeModalOpen, setIsViajeModalOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-0">
      {/* PET CARDS + MAPA */}
      <section className="flex gap-20 mb-10">
        <PetCards
          pets={mascotas}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          onPetAdded={(newPet) => setSelectedPet(newPet)}
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
          ubicacion={ubicacionUsuario}
          setSelectedPet={setSelectedPet}
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
            mascotas.map((m) => (m.id === updatedPet.id ? updatedPet : m))
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
