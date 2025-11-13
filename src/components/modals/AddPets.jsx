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
    if (name === "foto_url" && files[0]) {
      setForm({ ...form, foto_url: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

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
      {/* Card que abre el modal */}
<article
  className="mx-auto bg-[#f5f5dc]/50 w-[256px] flex-shrink-0 rounded-3xl h-[250px] p-5 flex justify-center items-center flex-col cursor-pointer
             shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
  onClick={() => setShowModal(true)}
>
  <span className="text-3xl font-bold text-[#22687b]">+</span>
  <p className="text-[#22687b] mt-2">Agregar mascota</p>
</article>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center w-full z-50">
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
              {/* Campos */}
              {[
                { label: "Nombre", name: "nombre", type: "text" },
                { label: "Especie", name: "especie", type: "text" },
                { label: "Raza", name: "raza", type: "text" },
                { label: "Fecha de nacimiento", name: "fecha_nacimiento", type: "date" },
                { label: "Peso (kg)", name: "peso", type: "number" },
                { label: "Color", name: "color", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-white mb-1">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={form[name] || ""}
                    onChange={handleChange}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
                  />
                </div>
              ))}

              {/* Sexo */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Sexo</label>
                <select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
                >
                  <option value="">Seleccionar</option>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </div>

              {/* Estado de salud */}
              <div>
                <label className="block text-sm font-medium text-white mb-1">Estado de salud</label>
                <input
                  type="text"
                  name="estado_salud"
                  value={form.estado_salud}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
                />
              </div>

              {/* Foto */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-white mb-1">Foto</label>
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

              {/* Localización */}
              {ubicacion && (
                <div className="col-span-2 bg-gray-100 p-3 rounded-lg text-sm text-gray-700 border">
                  <p>
                    <strong>Dirección:</strong> {ubicacion.direccion}
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
