import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { Card, Typography } from "@material-tailwind/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [newPet, setNewPet] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    peso: "",
    foto_url: "",
  });

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setCurrentPet(null);
      setNewPet({
        nombre: "",
        especie: "",
        raza: "",
        fecha_nacimiento: "",
        peso: "",
        foto_url: "",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: userInfo, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) setError(userError.message);
      else setUserData(userInfo);

      const { data: petsData, error: petsError } = await supabase
        .from("mascotas")
        .select("*")
        .eq("owner_id", user.id);

      if (petsError) setError(petsError.message);
      else setMascotas(petsData);

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setNewPet({
      ...newPet,
      [name]: type === "file" ? URL.createObjectURL(files[0]) : value,
    });
  };

  const handleSavePet = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (
      !newPet.nombre ||
      !newPet.especie ||
      !newPet.raza ||
      !newPet.fecha_nacimiento ||
      !newPet.peso ||
      !newPet.foto_url
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (currentPet) {
      const { error: updateError } = await supabase
        .from("mascotas")
        .update({ ...newPet })
        .eq("id", currentPet.id);

      if (updateError) setError(updateError.message);
      else {
        setMascotas((prev) =>
          prev.map((m) => (m.id === currentPet.id ? { ...m, ...newPet } : m))
        );
      }
    } else {
      const { data: inserted, error: insertError } = await supabase
        .from("mascotas")
        .insert([{ owner_id: user.id, ...newPet }])
        .select()
        .single();

      if (insertError) setError(insertError.message);
      else setMascotas((prev) => [...prev, inserted]);
    }

    toggleModal();
  };

  const handleEditPet = (pet) => {
    setCurrentPet(pet);
    setNewPet({
      nombre: pet.nombre,
      especie: pet.especie,
      raza: pet.raza,
      fecha_nacimiento: pet.fecha_nacimiento,
      peso: pet.peso,
      foto_url: pet.foto_url,
    });
    setModalOpen(true);
  };

  const handleDeletePet = async (pet) => {
    if (!window.confirm("¿Deseas eliminar esta mascota?")) return;

    const { error } = await supabase.from("mascotas").delete().eq("id", pet.id);

    if (error) setError(error.message);
    else setMascotas((prev) => prev.filter((m) => m.id !== pet.id));
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

        {error && <p className="text-red-500 mt-2">{error}</p>}

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
                <Typography>
                  <strong>Nombre:</strong> {m.nombre}
                </Typography>
                <Typography>
                  <strong>Especie:</strong> {m.especie}
                </Typography>
                <Typography>
                  <strong>Raza:</strong> {m.raza}
                </Typography>
                <Typography>
                  <strong>Edad:</strong> {calculateAge(m.fecha_nacimiento)} años
                </Typography>
                <Typography>
                  <strong>Peso:</strong> {m.peso} kg
                </Typography>

                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    className="btn-outline"
                    onClick={() => handleEditPet(m)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-outline"
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
    </div>
  );
}
