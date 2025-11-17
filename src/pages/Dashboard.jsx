import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import ModalMascota from "../components/ModalMascota";
import PersonalInform from "../components/PersonalInforme";
import Maps from "../components/maps/Maps";
import PetCards from "../components/ui/PetsCard";
import BtnPetMove from "../components/ui/BtnPetMove";
import { useSavedData } from "../context/SavedDataContext";
import MapsViewer from "../components/maps/MapsViewer";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mascotas, setMascotas] = useState([]);

  const { selectedPet, setSelectedPet, location } = useSavedData();

  const [ubicacion, setUbicacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setCurrentPet(null);
  };

  // --------------------------------------------
  // Load user and their pets
  // --------------------------------------------
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: userInfo } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

      setUserData(userInfo);

      const { data: petsData } = await supabase
        .from("mascotas")
        .select("*")
        .eq("owner_id", user.id);

      setMascotas(petsData || []);

      const { data: userUbication } = await supabase
        .from("localizacion_usuario")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      setUbicacion(userUbication);
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  // --------------------------------------------
  // Select first pet by default
  // --------------------------------------------
  useEffect(() => {
    if (!loading && mascotas.length > 0 && !selectedPet) {
      setSelectedPet(mascotas[0]);
    }
  }, [loading, mascotas, selectedPet, setSelectedPet]);

  // --------------------------------------------
  // Handle saving/updating pets
  // --------------------------------------------
  const handleSavePet = async (form, file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let fotoUrl = form.foto_url;

    if (file) {
      const fileName = `${user.id}_${Date.now()}_${file.name}`;
      const { data, error: uploadError } = await supabase.storage
        .from("mascotas")
        .upload(fileName, file);

      if (uploadError) {
        console.error("Error al subir imagen:", uploadError.message);
        setMessage("❌ Error al subir la imagen.");
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("mascotas")
        .getPublicUrl(fileName);

      fotoUrl = publicUrl.publicUrl;
    }

    if (currentPet) {
      const { error } = await supabase
        .from("mascotas")
        .update({ ...form, foto_url: fotoUrl })
        .eq("id", currentPet.id);

      if (!error) {
        setMascotas((prev) =>
          prev.map((m) =>
            m.id === currentPet.id ? { ...m, ...form, foto_url: fotoUrl } : m
          )
        );
        setMessage("✅ Mascota actualizada correctamente.");
      }
    } else {
      const { data: inserted, error } = await supabase
        .from("mascotas")
        .insert([{ owner_id: user.id, ...form, foto_url: fotoUrl }])
        .select()
        .single();

      if (!error && inserted) {
        setMascotas((prev) => [...prev, inserted]);
        setMessage("✅ Mascota agregada correctamente.");
      }
    }

    setTimeout(() => setMessage(""), 2000);
  };

  // --------------------------------------------
  // Delete pet
  // --------------------------------------------
  const handleDeletePet = async (pet) => {
    const { error } = await supabase.from("mascotas").delete().eq("id", pet.id);
    if (!error) {
      setMascotas((prev) => prev.filter((m) => m.id !== pet.id));
      setMessage("🗑️ Mascota eliminada correctamente.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  // --------------------------------------------
  // Select pet
  // --------------------------------------------
  const handleSelectPet = (petId) => {
    const pet = mascotas.find((m) => m.id === petId);
    if (!pet) return;

    setSelectedPet(pet);
  };

  // --------------------------------------------
  // Add new pet
  // --------------------------------------------
  const handlePetAdd = (newPet) => {
    setMascotas((prev) => [...prev, newPet]);
    setSelectedPet(newPet);
  };

  // --------------------------------------------
  // Calculate pet age
  // --------------------------------------------
  const calculateAge = (fecha_nacimiento) => {
    const birth = new Date(fecha_nacimiento);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <>
      <div className="max-w-7xl mx-auto p-0">
        <section className="flex gap-20 justify-between mb-10 w-full">
          <PersonalInform details={userData} locations={ubicacion} />

          <div className="flex flex-col gap-2 w-1/2">
            <MapsViewer selectedPet={selectedPet} location={location} />
            <BtnPetMove pet={selectedPet} userLocation={location} />
          </div>
        </section>

        <div className="bg-gray-300/50 w-full h-px my-10" />

        <section className="flex gap-20 mb-10 w-full justify-center items-center  z-0">
          <PetCards
            pets={mascotas}
            selectedPet={selectedPet}
            location={location}
            setSelectedPet={handleSelectPet}
            onPetAdded={handlePetAdd}
          />

          <Maps selectedPet={selectedPet} location={location}  modalOpen={modalOpen} />
        </section>
      </div>
    </>
  );
}