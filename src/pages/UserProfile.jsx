import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PetCards from "../components/ui/PetsCard";
import DetailsInform from "../components/DetailsInform";
import usePets from "../hooks/usePets";


export default function DetailsUser() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  const {
    mascotas,
    location,
    ubicacionUsuario,
    selectedPet,
    setSelectedPet,
    handleSavePet,
    handleDeletePet
  } = usePets();

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setCurrentPet(null);
  };

  // Datos del usuario
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await import("../services/supabase").then(mod => mod.supabase.auth.getUser());
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: detailsUser } = await import("../services/supabase").then(mod =>
        mod.supabase.from("usuarios").select("*").eq("id", user.id).single()
      );
      setUserData(detailsUser);
    };

    fetchUser();
  }, [navigate]);

  // Función para cuando se agrega una mascota desde el modal
  const handlePetAdd = (newPet) => {
    setSelectedPet(newPet); // selecciona la nueva mascota
  };

  return (
    <div className="max-w-7xl mx-auto mt-5">
      {/* Información del usuario */}
      <section>
        <DetailsInform details={userData} ubicacion={ubicacionUsuario} />
      </section>

      <div className="bg-gray-300/50 w-full h-px my-10" />

      {/* Mascotas */}
      <section>
        <PetCards
          pets={mascotas}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          onPetAdded={handlePetAdd} 
        />
      </section>

  
    </div>
  );
}
