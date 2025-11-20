import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PetCards from "../components/ui/PetsCard";
import DetailsInform from "../components/DetailsInform";
import usePets from "../hooks/usePets";

/**
 * seccion de info del usuario y administración de sus mascotas
 *
 * Este componente:
 * - Obtiene los datos del usuario autenticado desde Supabase
 * - Muestra la información personal del usuario mediante DetailsInform
 * - Lista todas las mascotas del usuario utilizando `PetCards`
 * - Permite seleccionar una mascota desde la sección de tarjetas
 * - Permite agregar mascotas nuevas y reflejar la selección inmediata
 *
 * Se apoya en el hook personalizado `usePets` para manejar:
 * - Lista de mascotas
 * - Ubicación del usuario
 * - Selección de mascota
 * - Métodos para editar o borrar mascotas
 *
 * @requires useNavigate - navegacion de reactrouterdom
 * @requires PetCards - Componente que renderiza cards de mascotas
 * @requires DetailsInform - componente que muestra la ficha del usuario
 * @requires usePets - Hook para gestionar el estado de mascotas y localización.
 *
 */


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

  // obtiene los datos del usuario autenticado y carga su información personal desde la tabla usuarios
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
