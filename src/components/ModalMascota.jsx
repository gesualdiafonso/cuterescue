import React, { useState, useEffect } from "react";

export default function ModalMascota({ isOpen, onClose, currentPet, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    peso: "",
    foto_url: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (currentPet) {
      setForm({
        nombre: currentPet.nombre || "",
        especie: currentPet.especie || "",
        raza: currentPet.raza || "",
        fecha_nacimiento: currentPet.fecha_nacimiento || "",
        peso: currentPet.peso || "",
        foto_url: currentPet.foto_url || "",
      });
      setPreview(currentPet.foto_url || null);
    } else {
      setForm({
        nombre: "",
        especie: "",
        raza: "",
        fecha_nacimiento: "",
        peso: "",
        foto_url: "",
      });
      setPreview(null);
    }
  }, [currentPet, isOpen]);

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
    if (
      !form.nombre ||
      !form.especie ||
      !form.raza ||
      !form.fecha_nacimiento ||
      !form.peso ||
      (!file && !form.foto_url)
    ) {
      setMessage("⚠️ Todos los campos son obligatorios.");
      return;
    }

    try {
      await onSave(form, file);
      setMessage("✅ Mascota guardada correctamente.");
      setTimeout(() => {
        setMessage("");
        onClose();
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error al guardar la mascota.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">
          {currentPet ? "Editar Mascota" : "Agregar Mascota"}
        </h2>

        <form className="modal-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Especie</label>
              <input
                type="text"
                name="especie"
                value={form.especie}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Raza</label>
              <input
                type="text"
                name="raza"
                value={form.raza}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Fecha de Nacimiento</label>
              <input
                type="date"
                name="fecha_nacimiento"
                value={form.fecha_nacimiento}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Peso (kg)</label>
              <input
                type="number"
                name="peso"
                value={form.peso}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="form-group w-full">
              <label>Foto</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {(preview || form.foto_url) && (
                <img
                  src={preview || form.foto_url}
                  alt="Vista previa"
                  className="w-full h-40 object-cover rounded-lg mt-2"
                />
              )}
            </div>
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
            <button
              type="button"
              className="btn-modal w-32"
              onClick={onClose}
            >
              Volver
            </button>
            <button
              type="button"
              className="btn-modal w-32"
              onClick={handleSubmit}
            >
              {currentPet ? "Editar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
