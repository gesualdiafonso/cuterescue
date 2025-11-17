import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { getCoordinatesFromAddress } from "../services/GeoAPI";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    tipoDocumento: "",
    documento: "",
    telefono: "",
    email: "",
    direccion: "",
    provincia: "",
    codigoPostal: "",
    password: "",
  });
  const [foto, setFoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password, ...userData } = formData;

    try {
      // 1️⃣ Crear usuario en AUTH
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      const userId = authData?.user?.id;

      // 2️⃣ Subir imagen de perfil si se seleccionó una
      let foto_url = "";
      if (foto) {
        const fileExt = foto.name.split(".").pop();
        const fileName = `${userId}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, foto, { upsert: true });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        foto_url = publicUrlData.publicUrl;
      }

      // 3️⃣ Buscar coordenadas en OSM
      const { lat, lng, source } = await getCoordinatesFromAddress({
        direccion: userData.direccion,
        codigoPostal: userData.codigoPostal,
        provincia: userData.provincia,
      });

      if (!lat || !lng) {
        throw new Error(
          "No se puede encontrar la dirección en el mapa. Verifica los datos ingresados."
        );
      }

      // 4️⃣ Insertar en la tabla 'usuarios'
      const { error: dbError } = await supabase.from("usuarios").insert([
        {
          id: userId,
          email,
          foto_url,
          ...userData,
        },
      ]);

      if (dbError) throw dbError;

      // 5️⃣ Insertar ubicación inicial
      const { error: dbError2 } = await supabase.from("localizacion_usuario").insert({
        direccion: userData.direccion,
        provincia: userData.provincia,
        codigoPostal: userData.codigoPostal,
        lat,
        lng,
        source,
        direccion_segura: true,
        owner_id: userId,
      });

      if (dbError2) throw dbError2;

      // 6️⃣ Redirigir al login
      navigate("/login");
    } catch (err) {
      console.error("Error en el registro:", err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <img
        src="src/assets/vetorpatas_trama.png"
        alt=""
        className="absolute w-full h-full object-cover -z-10 opacity-30"
      />
      <form
        onSubmit={handleRegister}
        className="rounded-2xl shadow-lg p-8 w-full max-w-3xl bg-[#22687B]/90 backdrop-blur-md"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Datos del titular
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          />

          {/* Fecha */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm text-white mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="bg-white text-black rounded-lg p-2 w-full"
              required
            />
          </div>

          {/* Documento */}
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          >
            <option value="">Tipo de documento</option>
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="CUIL">CUIL</option>
          </select>
          <input
            name="documento"
            placeholder="Número de documento"
            value={formData.documento}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          />

          {/* Teléfono y Email */}
          <input
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          />

          {/* Dirección */}
          <input
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full md:col-span-2"
            required
          />

          {/* Provincia y Código Postal */}
          <select
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          >
            <option value="">Seleccionar provincia</option>
            <option value="Buenos Aires">Buenos Aires</option>
            <option value="CABA">Ciudad Autónoma de Buenos Aires (CABA)</option>
            <option value="Córdoba">Córdoba</option>
            <option value="Santa Fe">Santa Fe</option>
            <option value="Mendoza">Mendoza</option>
          </select>
          <input
            name="codigoPostal"
            placeholder="Código postal"
            value={formData.codigoPostal}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          />

          {/* Foto del usuario */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm text-white mb-1">Foto de perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
              className="bg-white text-black rounded-lg p-2 w-full"
            />
          </div>

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full md:col-span-2"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-[#1e88e5] text-white mt-6 py-2 px-6 rounded-lg hover:bg-[#1976d2] w-full transition-all"
        >
          {loading ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
}
