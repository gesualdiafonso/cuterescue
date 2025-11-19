import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import { capitalizeAll } from "../../utils/text";

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

  //  Obtener ubicación del usuario
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

      if (error) console.error("Error al obtener ubicación:", error.message);
      setUbicacion(data);
    };

    if (showModal) fetchUbicacion();
  }, [showModal]);

  //  Manejo de inputs
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "foto_url" && files?.[0]) {
      setForm({ ...form, foto_url: files[0] });
      setPreview(URL.createObjectURL(files[0]));
      return;
    }

    // validacion de peso kg numeros positivos 
    if (name === "peso") {
      if (value === "" || Number(value) >= 0) {
        setForm({ ...form, [name]: value });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  // guarda mascota
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
      setLoading(false);
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado.");

      // Subir foto si corresponde
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

      // Insertar mascota
      const { data: pet, error: insertError } = await supabase
        .from("mascotas")
        .insert([
          {
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
            ubicacion_usuario: ubicacion?.id || null,
          },
        ])
        .select()
        .single();

      if (insertError) throw insertError;

      // Insertar ubicación inicial real
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

  const maxDate = new Date().toISOString().split("T")[0]; // Para bloquear fechas futuras

  return (
    <>
      {/* Card que abre el modal */}
      <article
        className="mx-auto bg-[#f5f5dc]/50 w-[256px] flex-shrink-0 rounded-3xl h-[250px] p-5 flex justify-center items-center flex-col cursor-pointer
             shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 "
        onClick={() => setShowModal(true)}
      >
        <span className="text-3xl font-bold text-[#22687b]">+</span>
        <p className="text-[#22687b] mt-2">Agregar mascota</p>
      </article>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center w-full z-[1000]">
          <div className="modalGlobal relative ">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 text-white hover:text-blue-300"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Agregar mascota
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
            >
              {/* Campo Nombre */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre || ""}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Especie → SELECT */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Especie
                </label>
                <select
                  name="especie"
                  value={form.especie}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  <option value="Canino">Canino</option>
                  <option value="Felino">Felino</option>
                </select>
              </div>

              {/* Raza */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Raza
                </label>
                <input
                  type="text"
                  name="raza"
                  value={form.raza || ""}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Fecha → No futura */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={form.fecha_nacimiento || ""}
                  max={maxDate}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Peso */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  name="peso"
                  min="0"
                  step="0.1"
                  value={form.peso || ""}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Color
                </label>
                <input
                  type="text"
                  name="color"
                  value={form.color || ""}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Sexo
                </label>
                <select
                  name="sexo"
                  value={form.sexo || ""}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>

              {/* Estado de salud */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Estado de salud
                </label>
                <input
                  type="text"
                  name="estado_salud"
                  value={form.estado_salud || ""}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Foto */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-white mb-1">
                  Foto
                </label>
                <input
                  type="file"
                  name="foto_url"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="mt-3 w-40 h-40 object-cover rounded-xl mx-auto"
                  />
                )}
              </div>

              {/* Ubicación */}
              {ubicacion && (
                <div className="col-span-2 bg-gray-100 p-3 rounded-lg text-sm text-gray-700 border">
                  <p>
                    <strong>Dirección:</strong> {capitalizeAll(ubicacion.direccion)}
                  </p>
                  <p>
                    <strong>Código Postal:</strong> {ubicacion.codigoPostal}
                  </p>
                  <p>
                    <strong>Provincia:</strong> {ubicacion.provincia}
                  </p>
                  <p className="text-green-700 font-medium mt-1">
                    📍 Esta será la ubicación inicial de tu mascota.
                  </p>
                </div>
              )}

              {message && (
                <p
                  className={`col-span-2 text-center mt-2 ${
                    message.includes("⚠️") || message.includes("❌")
                      ? "text-red-400"
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
                  className="btnNaranja px-8"
                >
                  {loading ? "Guardando..." : "Guardar mascota"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}