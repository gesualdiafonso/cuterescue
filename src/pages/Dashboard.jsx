import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { Button, Card, Input, Typography, Dialog } from "@material-tailwind/react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [newPet, setNewPet] = useState({ nombre: "", tipo: "", fechaNacimiento: "" });

  const toggleModal = () => setOpenModal(!openModal);

  // Traer datos del usuario y sus mascotas
  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Datos del usuario
      const { data: userInfo, error: userError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) {
        setError(userError.message);
      } else {
        setUserData(userInfo);
      }

      // Mascotas
      const { data: petsData, error: petsError } = await supabase
        .from("mascotas")
        .select("*")
        .eq("owner_id", user.id);

      if (petsError) {
        setError(petsError.message);
      } else {
        setMascotas(petsData);
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPet((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: insertError } = await supabase
      .from("mascotas")
      .insert([{ owner_id: user.id, ...newPet }]);

    if (insertError) {
      setError(insertError.message);
    } else {
      setMascotas((prev) => [...prev, { owner_id: user.id, ...newPet }]);
      setNewPet({ nombre: "", tipo: "", fechaNacimiento: "" });
      toggleModal();
    }
  };

  if (loading) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen p-8 bg-[#f0f4f8]">
      <Card className="max-w-3xl mx-auto p-6 shadow-lg rounded-2xl">
        <Typography variant="h4" className="mb-4">
          Bienvenido, {userData.nombre}!
        </Typography>
        <Typography>Email: {userData.email}</Typography>
        <Typography>Plan: {userData.plan || "Freemium"}</Typography>

        <div className="mt-6 flex justify-between items-center">
          <Typography variant="h5">Tus Mascotas</Typography>
          <Button color="blue" onClick={toggleModal}>
            Agregar Mascota
          </Button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {mascotas.length === 0 ? (
            <p>No tienes mascotas registradas.</p>
          ) : (
            mascotas.map((m, index) => (
              <Card key={index} className="p-4 shadow rounded-lg">
                <Typography>Nombre: {m.nombre}</Typography>
                <Typography>Tipo: {m.tipo}</Typography>
                <Typography>Fecha de nacimiento: {m.fechaNacimiento}</Typography>
              </Card>
            ))
          )}
        </div>
      </Card>

      {/* Modal Agregar Mascota */}
      <Dialog open={openModal} handler={toggleModal}>
        <Card color="white" shadow={false} className="p-6 rounded-lg">
          <Typography variant="h5" className="mb-4">
            Agregar Mascota
          </Typography>
          <form onSubmit={handleAddPet} className="flex flex-col gap-4">
            <Input
              name="nombre"
              label="Nombre"
              value={newPet.nombre}
              onChange={handleChange}
              required
            />
            <Input
              name="tipo"
              label="Tipo (Perro/Gato/otro)"
              value={newPet.tipo}
              onChange={handleChange}
              required
            />
            <Input
              type="date"
              name="fechaNacimiento"
              label="Fecha de nacimiento"
              value={newPet.fechaNacimiento}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end gap-2 mt-2">
              <Button color="gray" onClick={toggleModal}>
                Cancelar
              </Button>
              <Button type="submit" color="blue">
                Guardar
              </Button>
            </div>
          </form>
        </Card>
      </Dialog>
    </div>
  );
}
