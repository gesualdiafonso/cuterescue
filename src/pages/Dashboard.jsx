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

  // ✅ Dirección del usuario independiente
  const [ubicacionUsuario, setUbicacionUsuario] = useState(null);

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

    // Usuario
    const { data: userInfo } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", user.id)
      .single();
    setUserData(userInfo);

    // Mascotas + su última ubicación
    const { data: petsData } = await supabase
      .from("mascotas")
      .select("*")
      .eq("owner_id", user.id);

    if (petsData) {
      const petsWithLocation = await Promise.all(
        petsData.map(async (pet) => {
          const { data: loc } = await supabase
            .from("localizacion")
            .select("*")
            .eq("mascota_id", pet.id)
            .single();

          return { ...pet, localizacion: loc || null };
        })
      );

      setMascotas(petsWithLocation);

      if (!selectedPet && petsWithLocation.length > 0) {
        setSelectedPet(petsWithLocation[0]);
      }
    }

    const { data: userUbicacion } = await supabase
      .from("localizacion_usuario")
      .select("*")
      .eq("owner_id", user.id)
      .single();
    setUbicacionUsuario(userUbicacion);

    setLoading(false);
  };

  fetchData();
}, [navigate]); // ← SOLO ESTO, nunca selectedPet


  // --------------------------------------------
  // Seleccionar primera mascota por default
  // --------------------------------------------
  useEffect(() => {
    if (!loading && mascotas.length > 0 && !selectedPet) {
      setSelectedPet(mascotas[0]);
    }
  }, [loading, mascotas, selectedPet, setSelectedPet]);

  // --------------------------------------------
  // Guardar/actualizar mascota
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
  // Eliminar mascota
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
  // Seleccionar mascota
  // --------------------------------------------
  const handleSelectPet = (pet) => {
    setSelectedPet(pet);
  };

  // --------------------------------------------
  // Agregar nueva mascota
  // --------------------------------------------
  const handlePetAdd = (newPet) => {
    setMascotas((prev) => [...prev, newPet]);
    setSelectedPet(newPet);
  };

  // --------------------------------------------
  // Calcular edad
  // --------------------------------------------
  const calculateAge = (fecha_nacimiento) => {
    const birth = new Date(fecha_nacimiento);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <>
      {message && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded z-50">
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-0">
        <section className="flex gap-20 justify-between mb-10 w-full">
          {/* Personal info con ubicación del usuario */}
          <PersonalInform details={userData} locations={ubicacionUsuario} />

          {/* Mapas y botón de movimiento */}
          <div className="flex flex-col gap-2 w-1/2">
            <MapsViewer selectedPet={selectedPet} location={location} />
            <BtnPetMove pet={selectedPet} userLocation={location} />
          </div>
        </section>

        <div className="bg-gray-300/50 w-full h-px my-10" />

        <section className="flex gap-20 mb-10 w-full justify-center items-center z-0">
          <PetCards
              pets={mascotas}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
            onPetAdded={handlePetAdd}
          />

          <Maps selectedPet={selectedPet} location={location} modalOpen={modalOpen} />
        </section>
      </div>

      {/* Modal para agregar/editar mascota */}
      {modalOpen && (
        <ModalMascota
          pet={currentPet}
          onClose={toggleModal}
          onSave={handleSavePet}
        />
      )}
    </>
  );
}
