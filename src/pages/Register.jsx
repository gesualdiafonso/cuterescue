import { useState } from "react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";
import { getCoordinatesFromAddress } from "../services/GeoAPI";
import { provinciasArg } from "../constants/provincias";

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
    genero: "", // 🆕
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
      //  Crear usuario en AUTH
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      const userId = authData.user.id;

      //  Obtener coordenadas
      const { lat, lng, source } = await getCoordinatesFromAddress({
        direccion: userData.direccion,
        codigoPostal: userData.codigoPostal,
        provincia: userData.provincia,
      });

      // Si geocodificación falla, NO se corta el registro
      const latFinal = lat ?? -34.6037; // fallback CABA centro
      const lngFinal = lng ?? -58.3816;

      //  Insertar usuario en la tabla usuarios
      const { data: insertedUser, error: userInsertError } = await supabase
        .from("usuarios")
        .insert([
          {
            id: userId,
            email,
            nombre: userData.nombre,
            apellido: userData.apellido,
            fechaNacimiento: userData.fechaNacimiento,
            tipoDocumento: userData.tipoDocumento,
            documento: userData.documento,
            telefono: userData.telefono,
            direccion: userData.direccion,
            provincia: userData.provincia,
            codigoPostal: userData.codigoPostal,
            genero: userData.genero || null,
            foto_url: "",
          },
        ])
        .select()
        .single();

      console.log("✅ Usuario insertado en tabla usuarios:", insertedUser);
      if (userInsertError) {
        console.error("❌ Error insertando en usuarios:", userInsertError);
        throw userInsertError;
      }

      // insertar ubicacion inicial
      const { error: locInsertError } = await supabase
        .from("localizacion_usuario")
        .insert({
          owner_id: userId,
          direccion: userData.direccion,
          provincia: userData.provincia,
          codigoPostal: userData.codigoPostal,
          lat: latFinal,
          lng: lngFinal,
          source,
          direccion_segura: true,
        });

      if (locInsertError) {
        console.error("❌ Error insertando en localizacion_usuario:", locInsertError);
        throw locInsertError;
      }

      // subir foto
      let foto_url = "";
      if (foto) {
        const ext = foto.name.split(".").pop();
        const fileName = `${userId}.${ext}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, foto, { upsert: true });

        if (uploadError) {
          console.error("❌ Error subiendo foto:", uploadError);
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        foto_url = publicUrlData.publicUrl;

        //  actualizar foto_url en usuarios
        const { error: updateError } = await supabase
          .from("usuarios")
          .update({ foto_url })
          .eq("id", userId);

        if (updateError) {
          console.error("❌ Error actualizando foto_url:", updateError);
          throw updateError;
        }
      }

      //  redirigir al dashboard 
      navigate("/dashboard");
    } catch (err) {
      console.error("🔥 Error en el registro:", err);
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-[80vh] flex flex-col justify-center items-center relative overflow-hidden">
      <img
        src="src/assets/vetorpatas_trama.png"
        alt=""
        className="absolute w-full h-full object-cover -z-10 opacity-30"
      />

      <form
        onSubmit={handleRegister}
        className="rounded-2xl shadow-lg p-8 w-full max-w-3xl bg-gray-500/50 backdrop-blur-md"
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

          {/* Fecha de nacimiento */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm text-white mb-1">Fecha de nacimiento</label>
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

          {/* Provincia */}
          <select
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          >
            <option value="">Seleccionar provincia</option>
            {provinciasArg.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>

          <input
            name="codigoPostal"
            placeholder="Código postal"
            value={formData.codigoPostal}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full"
            required
          />

          {/* Género */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm text-white mb-1">Género</label>
            <select
              name="genero"
              value={formData.genero}
              onChange={handleChange}
              className="bg-white text-black rounded-lg p-2 w-full"
              required
            >
              <option value="">Seleccionar</option>
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="No Binario">No binario</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Foto */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm text-white mb-1">Foto de perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFoto(e.target.files[0])}
              className="bg-white text-black rounded-lg p-2 w-full"
            />
          </div>

          {/* Contraseña */}
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
          className="bg-cyan-700 text-center px-10 py-2 text-white font-semibold rounded-md hover:bg-cyan-800 transition-all w-full mt-5"
        >
          {loading ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </div>
  );
}
