// src/components/modals/ModalEdicionUsuario.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

export default function ModalEdicionUsuario({ isOpen, onClose, currentUser, ubicacion, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    genero: "",
    fechaNacimiento: "",
    tipoDocumento: "",
    documento: "",
    direccion: "",
    codigoPostal: "",
    provincia: "",
    foto_url: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentUser) {
      setForm({
        nombre: currentUser.nombre || "",
        apellido: currentUser.apellido || "",
        email: currentUser.email || "",
        telefono: currentUser.telefono || "",
        genero: currentUser.genero || "",
        fechaNacimiento: currentUser.fechaNacimiento || "",
        tipoDocumento: currentUser.tipoDocumento || "",
        documento: currentUser.documento || "",
        direccion: ubicacion?.direccion || "",
        codigoPostal: ubicacion?.codigoPostal || "",
        provincia: ubicacion?.provincia || "",
        foto_url: currentUser.foto_url || "",
      });
      setPreview(currentUser.foto_url || null);
    }
  }, [currentUser, ubicacion, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.nombre || !form.apellido) {
        setMessage("⚠️ El nombre y apellido son obligatorios.");
        return;
      }

      let fotoPublicUrl = form.foto_url;
      if (file) {
        const fileName = `${currentUser.id}-${Date.now()}.${file.name.split(".").pop()}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
        fotoPublicUrl = data.publicUrl;
      }

      const { error: userError } = await supabase
        .from("usuarios")
        .update({
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          genero: form.genero,
          fechaNacimiento: form.fechaNacimiento,
          tipoDocumento: form.tipoDocumento,
          documento: form.documento,
          email: form.email,
          foto_url: fotoPublicUrl,
        })
        .eq("id", currentUser.id);

      if (userError) throw userError;

      const { error: locError } = await supabase
        .from("localizacion_usuario")
        .update({
          direccion: form.direccion,
          codigoPostal: form.codigoPostal,
          provincia: form.provincia,
          update_at: new Date(),
        })
        .eq("owner_id", currentUser.id);

      if (locError) throw locError;

      setMessage("✅ Perfil actualizado correctamente.");
      await onSave();
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al actualizar los datos.");
    }
  };

  return (
    <div className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="modal-container bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#ffffff]">Editar perfil</h2>

        <div className="flex flex-col gap-2 ">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3 ">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Nombre</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Apellido</label>
              <input
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Teléfono</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Fecha de nacimiento</label>
            <input
              type="date"
              name="fechaNacimiento"
              value={form.fechaNacimiento}
              onChange={handleChange}
              className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
            />
          </div>

          {/* Documento */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Tipo de documento</label>
              <input
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
                className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Número de documento</label>
              <input
                name="documento"
                value={form.documento}
                onChange={handleChange}
                className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
              />
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Dirección</label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
            />
          </div>

          {/* Código postal y provincia */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Código postal</label>
              <input
                name="codigoPostal"
                value={form.codigoPostal}
                onChange={handleChange}
                className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Provincia</label>
              <input
                name="provincia"
                value={form.provincia}
                onChange={handleChange}
                className="w-full text-black bg-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#22687B]"
              />
            </div>
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Foto de perfil</label>
            <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm" />
            {(preview || form.foto_url) && (
              <img src={preview || form.foto_url} alt="Vista previa" className="w-full h-40 object-cover rounded-lg mt-2" />
            )}
          </div>

          {message && (
            <p
              className={`mt-3 text-center ${
                message.includes("⚠️") || message.includes("❌") ? "text-red-500" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          {/* Botones originales */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={onClose}
              className="btn-modal"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn-modal"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
