import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

export default function ModalEdicionUsuario({ isOpen, onClose, currentUser, onSave }) {

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    genero: "",
    fechaNacimiento: "",
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
        foto_url: currentUser.foto_url || "",
      });
      setPreview(currentUser.foto_url || null);
    } else {
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        genero: "",
        fechaNacimiento: "",
        foto_url: "",
      });
      setPreview(null);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.apellido || (!file && !form.foto_url)) {
      setMessage("⚠️ Todos los campos obligatorios deben completarse.");
      return;
    }

    try {
      let fotoPublicUrl = form.foto_url;

      // ✅ Si hay un nuevo archivo seleccionado, subilo a Supabase Storage
      if (file) {
        const fileName = `${currentUser.id}-${Date.now()}.${file.name.split(".").pop()}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars") // 🪣 tu bucket
          .upload(fileName, file, { upsert: true });

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(fileName);
        fotoPublicUrl = data.publicUrl;
      }

      // ✅ Actualizar registro del usuario
      const { error: updateError } = await supabase
        .from("usuarios")
        .update({
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          genero: form.genero,
          fechaNacimiento: form.fechaNacimiento,
          foto_url: fotoPublicUrl,
        })
        .eq("id", currentUser.id);

      if (updateError) throw updateError;

      await onSave(); // refrescar datos del perfil

      setMessage("✅ Perfil actualizado correctamente.");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al actualizar el perfil.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">Editar Perfil</h2>

        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input type="text" name="apellido" value={form.apellido} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Foto de perfil</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {(preview || form.foto_url) && (
              <img
                src={preview || form.foto_url}
                alt="Vista previa"
                className="w-full h-40 object-cover rounded-lg mt-2"
              />
            )}
          </div>

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

          <div className="form-actions flex justify-center mt-4">
            <button type="button" className="btn-modal w-32" onClick={onClose}>
              Volver
            </button>
            <button type="button" className="btn-modal w-32" onClick={handleSubmit}>
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
