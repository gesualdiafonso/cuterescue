import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";
import ModalMascota from "../components/ModalMascota";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) setCurrentPet(null);
  };

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
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleSavePet = async (form, file) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let fotoUrl = form.foto_url;

    // Si hay archivo nuevo, subirlo
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

  const handleDeletePet = async (pet) => {
    const { error } = await supabase.from("mascotas").delete().eq("id", pet.id);
    if (!error) {
      setMascotas((prev) => prev.filter((m) => m.id !== pet.id));
      setMessage("🗑️ Mascota eliminada correctamente.");
      setTimeout(() => setMessage(""), 2000);
    }
  };

  const calculateAge = (fecha_nacimiento) => {
    const birth = new Date(fecha_nacimiento);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen p-8 bg-[#f0f4f8]">
      <Card className="max-w-4xl mx-auto p-6 shadow-lg rounded-2xl">
        <Typography variant="h4" className="mb-4">
          Bienvenido, {userData?.nombre || "Usuario"}!
        </Typography>
        <Typography>Email: {userData?.email}</Typography>
        <Typography>Plan: {userData?.plan || "Freemium"}</Typography>

        <div className="mt-6 flex justify-between items-center">
          <Typography variant="h5">Tus Mascotas</Typography>
          <button onClick={toggleModal} className="btn-outline">
            Agregar Mascota
          </button>
        </div>

        {message && (
          <p className="text-center mt-3 text-violet-600 font-medium">
            {message}
          </p>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {mascotas.length === 0 ? (
            <p>No tienes mascotas registradas.</p>
          ) : (
            mascotas.map((m) => (
              <div key={m.id} className="p-4 border rounded-lg shadow relative">
                {m.foto_url && (
                  <img
                    src={m.foto_url}
                    alt={m.nombre}
                    className="w-full h-60 object-cover rounded-lg mb-2"
                  />
                )}
                <Typography><strong>Nombre:</strong> {m.nombre}</Typography>
                <Typography><strong>Especie:</strong> {m.especie}</Typography>
                <Typography><strong>Raza:</strong> {m.raza}</Typography>
                <Typography>
                  <strong>Edad:</strong> {calculateAge(m.fecha_nacimiento)} años
                </Typography>
                <Typography><strong>Peso:</strong> {m.peso} kg</Typography>

                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="btn-outline"
                    onClick={() => {
                      setCurrentPet(m);
                      setModalOpen(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-outline text-red-500"
                    onClick={() => handleDeletePet(m)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      <ModalMascota
        isOpen={modalOpen}
        onClose={toggleModal}
        currentPet={currentPet}
        onSave={handleSavePet}
      />
    </div>
  );
}
