import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import patron from "../assets/images/ui/patron.png";

export default function AgregarMascota() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    sexo: "",
    color: "",
    peso: "",
    foto_url: "",
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
      return;
    }

    let fotoUrl = form.foto_url;

    if (file) {
      const fileName = `${user.id}_${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("mascotas")
        .upload(fileName, file);

      if (uploadError) {
        setMessage("❌ Error al subir la imagen.");
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("mascotas")
        .getPublicUrl(fileName);

      fotoUrl = publicUrl.publicUrl;
    }

    const { error } = await supabase
      .from("mascotas")
      .insert([{ owner_id: user.id, ...form, foto_url: fotoUrl }]);

    if (error) {
      console.error(error);
      setMessage("❌ Error al guardar la mascota.");
    } else {
      setMessage("✅ Mascota agregada correctamente.");
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  };

  return (
    <div
      className=" bg-cover bg-center flex flex-col lg:flex-row justify-center lg:justify-end items-center lg:items-stretch px-15 py-0"
      style={{
        backgroundImage: `url(${patron})`,
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      {/* Contenedor del formulario */}
      <div className="bg-[#1d6b73] text-[#ffb800] w-full lg:w-[40%] xl:w-[35%]  lg:min-h-full  p-8 flex flex-col justify-between">
        <h2 className="text-3xl md:text-4xl font-extrabold leading-snug mb-8 text-center">
          Vamos a agregar a su mascota,<br />siga los pasos
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-between gap-6 overflow-visible"
        >
          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="mb-1">Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Full name"
                className="input-field w-full"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Especie</label>
              <select
                name="especie"
                value={form.especie}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="">Seleccionar especie</option>
                <option value="Canino">Canino</option>
                <option value="Felino">Felino</option>
                <option value="Conejo">Conejo</option>
                <option value="Hurón">Hurón</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Raza</label>
              <input
                type="text"
                name="raza"
                value={form.raza}
                onChange={handleChange}
                placeholder="Nombre especie"
                className="input-field w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Fecha de nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                className="input-field w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Sexo</label>
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                className="input-field w-full"
                required
              >
                <option value="">Seleccionar</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Color</label>
              <input
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Color de la mascota"
                className="input-field w-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Foto de la mascota</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="input-field w-full file:mr-2"
              />
            </div>

            <div className="flex flex-col">
              <label className="mb-1">Peso</label>
              <input
                type="text"
                name="peso"
                value={form.peso}
                onChange={handleChange}
                placeholder="Peso en kg"
                className="input-field w-full"
              />
            </div>
          </div>

          {message && (
            <p className="text-center mt-4 text-[#ffb800] font-medium">
              {message}
            </p>
          )}

          {/* Botones */}
          <div className="flex flex-col md:flex-row justify-between gap-4 mt-8 w-full">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="btn-modal w-full md:w-auto"
            >
              Volver
            </button>
            <button type="submit" className="btn-modal w-full md:w-auto">
              Avanzar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
