import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

export default function AddPets({ onPetAdded }) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    peso: "",
    sexo: "",
    color: "",
    estado_salud: "",
    foto_url: null,
  });
  const [ubicacion, setUbicacion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");


  // Vamos bucar la localizacion del usuario al abrir modal
  useEffect(() => {
    const fetchUbicacion = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if(!user) return;

      const { data, error } = await supabase
        .from("localizacion_usuario")
        .select("*")
        .eq("owner_id", user.id)
        .single()

      if(error) console.error("Error al obtener ubicación: ", error.message)
      setUbicacion(data)
    };

    if(showModal) fetchUbicacion();

  }, [showModal])

  // Atualiza campos del formulário
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "foto_url" && files[0]) {
      setForm({ ...form, foto_url: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Envia pet al Supabase y cria localización basada en la del usuario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (
      !form.nombre ||
      !form.especie ||
      !form.raza ||
      !form.fecha_nacimiento ||
      !form.peso ||
      !form.color ||
      !form.sexo
    ) {
      setMessage("⚠️ Todos los campos son obligatorios.");
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      // 1️⃣ Upload da imagem (se houver)
      let fotoUrl = null;
      if (form.foto_url instanceof File) {
        const fileName = `${user.id}_${Date.now()}_${form.foto_url.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("mascotas")
          .upload(fileName, form.foto_url);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("mascotas")
          .getPublicUrl(fileName);

        fotoUrl = publicUrl.publicUrl;
      }

      // 2️⃣ Inserir dados na tabela "mascotas"
      const { data: pet, error: insertError } = await supabase
        .from("mascotas")
        .insert([{
          owner_id: user.id,
          nombre: form.nombre,
          especie: form.especie,
          raza: form.raza,
          fecha_nacimiento: form.fecha_nacimiento,
          peso: parseInt(form.peso),
          sexo: form.sexo,
          color: form.color,
          estado_salud: form.estado_salud,
          foto_url: fotoUrl,
        }])
        .select()
        .single();

      if(insertError) throw insertError;

      // Inserir la localizacion del pet basado en la localizacion del usuario
      if(ubicacion){
        const { direccion, codigoPostal, provincia, lat, lng, source } = ubicacion
        const { error: locErro } = await supabase
          .from("localizacion")
          .insert([{
            owner_id: user.id,
            mascota_id: pet.id,
            chip_id: "1111",
            direccion,
            codigoPostal,
            provincia,
            lat,
            lng,
            source,
            localizacion_segura: true,
            created_at: new Date(),
          }]);

          if(locErro) throw locErro;
      }

     onPetAdded(pet);
     setMessage(" Mascota registrada correctamente");

     setShowModal(false);
     setForm({});
     setPreview(null)
      // Atualiza pets no Dashboard

    } catch (err) {
      console.error("Erro ao adicionar pet:", err);
      alert("❌ Falha ao adicionar pet: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };


  return (
    <>
      {/* Card que abre o modal */}
      <article
        className="mx-auto bg-[#f5f5dc]/50 w-[256px] flex-shrink-0 rounded-3xl h-[250px] p-5 flex justify-center items-center flex-col cursor-pointer hover:scale-105 transition-transform"
        onClick={() => setShowModal(true)}
      >
        <span className="text-3xl font-bold text-[#22687b]">+</span>
        <p className="text-[#22687b] mt-2">Agregar más pet</p>
      </article>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex gap-20 justify-center items-center w-full z-50">
          <div className="bg-[#22687b] rounded-2xl p-6 w-[90%] max-w-lg relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-white hover:text-blue-400"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">Agregar nuevo Pet</h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-10 max-h-[80vh] max-w-[60wh] overflow-y-auto"
            >
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-[#fd9b08] p-2 bg-white"
              />
              <input
                type="text"
                name="especie"
                placeholder="Especie"
                value={form.especie}
                onChange={handleChange}
                required
                className="w-full border border-[#fd9b08] p-2 bg-white"
              />
              <input
                type="text"
                name="raza"
                placeholder="Raza"
                value={form.raza}
                onChange={handleChange}
                className="w-full border border-[#fd9b08] p-2 bg-white"
              />
              <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                className="w-full border border-[#fd9b08] p-2 bg-white"
              />
              <input
                type="number"
                name="peso"
                placeholder="peso"
                value={form.peso}
                onChange={handleChange}
                className="w-full border border-[#fd9b08] p-2 bg-white"
              />
              <select
                name="sexo"
                value={form.sexo}
                onChange={handleChange}
                className="w-full border border-[#fd9b08] p-2 bg-white"
              >
                <option value="">Sexo</option>
                <option value="Macho">Macho</option>
                <option value="Hembra">Hembra</option>
              </select>
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={form.color}
                onChange={handleChange}
                className="w-full border border-[#fd9b08] p-2 bg-white"
              />
              <input
                type="text"
                name="estado_salud"
                placeholder="Estado de salud"
                value={form.estado_salud}
                onChange={handleChange}
                className="w-full border border-[#fd9b08] p-2 bg-white"
              />
              <div>
                <label className="block mb-1 text-sm text-white">Foto</label>
                <input
                  type="file"
                  name="foto_url"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full border border-[#fd9b08] p-2 bg-white"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-2 w-32 h-32 object-cover rounded-xl"
                  />
                )}
              </div>

              {/* Localizacion bloqueada de usuario a pet */}
              {ubicacion && (
                <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 border">
                  <p><strong>Dirección:</strong> {ubicacion.direccion}</p>
                  <p><strong>Código Postal:</strong> {ubicacion.codigoPostal}</p>
                  <p><strong>Provincia:</strong> {ubicacion.provincia}</p>
                  <p className="text-green-700 font-medium mt-1">📍 Esta será la ubicación inicial de tu mascota.</p>
                </div>
              )}
              {message && (
                <p
                  className={`mt-3 text-center ${
                    message.includes("⚠️") || message.includes("❌")
                      ? "text-red-500"
                      : "text-green-600"
                  }`}
                >
                  {message}
                </p>
              )}


              <button
                type="submit"
                disabled={loading}
                className="bg-[#fd9b08] text-white py-2 rounded-lg hover:bg-orange-300 transition-colors"
              >
                {loading ? "Guardando..." : "Guardar Pet"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
