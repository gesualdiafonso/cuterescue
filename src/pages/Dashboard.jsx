import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSavedData } from "../context/SavedDataContext";
import usePets from "../hooks/usePets";

import PersonalInform from "../components/PersonalInforme";
import Maps from "../components/maps/Maps";
import MapsViewer from "../components/maps/MapsViewer";
import PetCards from "../components/ui/PetsCard";
import BtnPetMove from "../components/ui/BtnPetMove";

export default function Dashboard() {
  const navigate = useNavigate();
  const { selectedPet, setSelectedPet, location } = useSavedData();

  const {
    mascotas,
    ubicacionUsuario,
    refreshPets,      // 👈 NUEVO
  } = usePets();

  const [userData, setUserData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setCurrentPet(null);
  };

  // Datos de usuario
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await import("../services/supabase").then((mod) =>
        mod.supabase.auth.getUser()
      );
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: userInfo } = await import("../services/supabase").then(
        (mod) =>
          mod.supabase
            .from("usuarios")
            .select("*")
            .eq("id", user.id)
            .single()
      );
      setUserData(userInfo);
    };

    fetchUser();
  }, [navigate]);

  // 👉 cuando AddPets crea una nueva
  const handlePetAdded = (newPet) => {
    // recargamos lista desde Supabase
    refreshPets();
    // y marcamos esa como seleccionada (SavedDataContext)
    if (newPet) {
      setSelectedPet(newPet);
    }
  };

  if (!mascotas) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <>
      <div className="w-full px-4 lg:px-0 max-w-7xl mx-auto mt-5">
        {/* Sección principal: info personal y mapa */}
        <section className="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between mb-10 w-full">
          <PersonalInform details={userData} locations={ubicacionUsuario} />

          <div className="flex flex-col gap-2 w-full lg:w-1/2">
            <MapsViewer selectedPet={selectedPet} location={location} />
            <BtnPetMove pet={selectedPet} userLocation={location} />
          </div>
        </section>

        <div className="bg-gray-300/50 w-full h-px my-10" />

        {/* Mascotas + Mapa */}
        <section className="flex flex-col lg:flex-row gap-10 lg:gap-20 mb-10 w-full justify-center items-center z-0">
          <PetCards
            pets={mascotas}
            selectedPet={selectedPet}
            setSelectedPet={setSelectedPet}
            onPetAdded={handlePetAdded}   
            refreshPets={refreshPets}     //   para editar/borrar en realtime
          />

          <div className="w-full lg:w-auto">
            <Maps selectedPet={selectedPet} location={location} modalOpen={modalOpen} />
          </div>
        </section>
      </div>

      {modalOpen && (
        <ModalMascota
          pet={currentPet}
          onClose={toggleModal}
          // si este modal también crea/edita pets,
          // internamente puede usar refreshPets pasado por props
        />
      )}
    </>
  );
}
