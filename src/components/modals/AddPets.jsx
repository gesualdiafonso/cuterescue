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

  useEffect(() => {
    const fetchUbicacion = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("localizacion_usuario")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (error) console.error("Error al obtener ubicación: ", error.message);
      setUbicacion(data);
    };

    if (showModal) fetchUbicacion();
  }, [showModal]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto_url" && files?.[0]) {
      setForm({ ...form, foto_url: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      return;
    }

    // Validación peso solo números positivos
    if (name === "peso" && value !== "") {
      if (!/^\d*\.?\d*$/.test(value)) return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // ❌ Validación: NO permitir fecha futura
    const today = new Date().toISOString().split("T")[0];
    if (form.fecha_nacimiento > today) {
      setMessage("⚠️ La fecha de nacimiento no puede ser futura.");
      setLoading(false);
      return;
    }

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
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado.");

      let fotoUrl = null;

      if (form.foto_url instanceof File) {
        const fileName = `${user.id}_${Date.now()}_${form.foto_url.name}`;
        const { error: uploadError } = await supabase.storage
          .from("mascotas")
          .upload(fileName, form.foto_url);

        if (uploadError) throw uploadError;

        const { data: publicUrl } = supabase.storage
          .from("mascotas")
          .getPublicUrl(fileName);

        fotoUrl = publicUrl.publicUrl;
      }

      const { data: pet, error: insertError } = await supabase
        .from("mascotas")
        .insert([
          {
            owner_id: user.id,
            nombre: form.nombre,
            especie: form.especie,
            raza: form.raza,
            fecha_nacimiento: form.fecha_nacimiento,
            peso: parseFloat(form.peso),
            sexo: form.sexo,
            color: form.color,
            estado_salud: form.estado_salud,
            foto_url: fotoUrl,
            ubicacion_usuario: ubicacion?.id || null,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      if (ubicacion) {
        const { direccion, codigoPostal, provincia, lat, lng, source } = ubicacion;

        const { error: locError } = await supabase.from("localizacion").insert([
          {
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
          },
        ]);

        if (locError) throw locError;
      }

      onPetAdded(pet);
      setMessage("✅ Mascota registrada correctamente.");
      setShowModal(false);
      setForm({});
      setPreview(null);
    } catch (err) {
      console.error("Error al agregar pet:", err);
      alert("❌ Falló al agregar pet: " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <>
      {/* CARD */}
      <article
        className="mx-auto bg-[#f5f5dc]/50 w-[256px] flex-shrink-0 rounded-3xl h-[250px] p-5 flex justify-center items-center flex-col cursor-pointer shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
        onClick={() => setShowModal(true)}
      >
        <span className="text-3xl font-bold text-[#22687b]">+</span>
        <p className="text-[#22687b] mt-2">Agregar mascota</p>
      </article>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center w-full z-[1000]">
          <div className="bg-[#22687b] rounded-2xl p-6 w-[90%] max-w-lg relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-white hover:text-blue-300"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Agregar nuevo Pet
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Nombre */}
              <div>
                <label className="text-sm text-white mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                />
              </div>

              {/* ESPECIE → SELECT */}
              <div>
                <label className="text-sm text-white mb-1">Especie</label>
                <select
                  name="especie"
                  value={form.especie}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  <option value="Canino">Canino</option>
                  <option value="Felino">Felino</option>
                </select>
              </div>

              {/* Raza */}
              <div>
                <label className="text-sm text-white mb-1">Raza</label>
                <input
                  type="text"
                  name="raza"
                  value={form.raza}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                />
              </div>

              {/* FECHA NACIMIENTO → sin fechas futuras */}
              <div>
                <label className="text-sm text-white mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  max={new Date().toISOString().split("T")[0]}
                  value={form.fecha_nacimiento}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                />
              </div>

              {/* Peso → solo números */}
              <div>
                <label className="text-sm text-white mb-1">Peso (kg)</label>
                <input
                  type="number"
                  name="peso"
                  min="0"
                  step="0.1"
                  value={form.peso}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                />
              </div>

              {/* Color */}
              <div>
                <label className="text-sm text-white mb-1">Color</label>
                <input
                  type="text"
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                />
              </div>

              {/* SELECCION SEXO */}
              <div>
                <label className="text-sm text-white mb-1">Sexo</label>
                <select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>

              {/* ESTADO SALUD */}
              <div>
                <label className="text-sm text-white mb-1">Estado de salud</label>
                <input
                  type="text"
                  name="estado_salud"
                  value={form.estado_salud}
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                />
              </div>

              {/* FOTO */}
              <div className="col-span-2">
                <label className="text-sm text-white mb-1">Foto</label>
                <input
                  type="file"
                  name="foto_url"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full bg-white rounded-lg px-3 py-2"
                />
                {preview && (
                  <img
                    src={preview}
                    className="w-40 h-40 mt-3 rounded-xl object-cover mx-auto"
                  />
                )}
              </div>

              {message && (
                <p
                  className={`col-span-2 text-center mt-2 ${
                    message.includes("⚠️") || message.includes("❌")
                      ? "text-red-300"
                      : "text-green-300"
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="col-span-2 flex justify-center mt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#fd9b08] text-white px-6 py-2 rounded-lg hover:bg-[#f7a82a] transition"
                >
                  {loading ? "Guardando..." : "Guardar Pet"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
