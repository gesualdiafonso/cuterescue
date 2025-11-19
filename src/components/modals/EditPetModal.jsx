import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";

export default function EditPetModal({ pet, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    fecha_nacimiento: "",
    peso: "",
    sexo: "",
    color: "",
    estado_salud: "",
    foto_url: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (pet) {
      setForm({ ...pet });
      setPreview(pet.foto_url || null);
    }
  }, [pet]);

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
    try {
      let newFotoUrl = form.foto_url;

      if (file) {
        const filePath = `pets/${pet.id}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
        newFotoUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("mascotas")
        .update({ ...form, foto_url: newFotoUrl, updated_at: new Date() })
        .eq("id", pet.id);

      if (error) throw error;

      setMessage("✅ Mascota actualizada correctamente");
      setTimeout(() => {
        onSave?.();
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error al actualizar la mascota");
    }
  };

  if (!pet) return null;

  return (
    <div className="fixed inset-0 bg-black/90 z-[2000] flex justify-center items-center p-4">
      <div className="modalGlobal max-w-3xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Editar Mascota
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "nombre",
            "especie",
            "raza",
            "peso",
            "sexo",
            "color",
            "estado_salud",
            "fecha_nacimiento",
          ].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="font-light text-white capitalize mb-1">
                {field.replace("_", " ")}
              </label>
              <input
                type={field === "fecha_nacimiento" ? "date" : "text"}
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                className="border border-white p-2 rounded-lg bg-white text-black"
              />
            </div>
          ))}

          <div className="flex flex-col md:col-span-2">
            <label className="font-light text-white mb-1">Foto</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
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
            className={`text-center mt-4 ${
              message.includes("✅") ? "text-green-200" : "text-red-300"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex justify-center gap-6 mt-6">
          <button
            onClick={onClose}
               className=" btnTransparente px-8 "
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="btnNaranja px-8"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
