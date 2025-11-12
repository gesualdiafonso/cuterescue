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
      // 1. crea usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      const userId = authData?.user?.id;

      // 2.0 Busca las coordenadas en OSM (GeoAPI)
      const { lat, lng, source } = await getCoordinatesFromAddress({
        direccion: userData.direccion,
        codigoPostal: userData.codigoPostal,
        provincia: userData.provincia
      });

      // Si no lo encontra la ubicaicón valida, mostre error
      if(!lat || !lng){
        setError(
          "No se puede econtrar la dirección en el mapa. Verifica los datos ingresados"
        );
        setLoading(false);
        return;
      }

      // 2. inserto datos en la tabla 'usuarios'
      const { error: dbError } = await supabase
        .from("usuarios")
        .insert([{ id: authData.user.id, email, ...userData }]);

      if (dbError) {
        setError(dbError.message);
        setLoading(false);
        return;
      }

      // 3. inserta ubicación inicial en la tabal 'localizacion_usuario'
      const { error: dbError2 } = await supabase
        .from("localizacion_usuario")
        .insert({
          direccion: `${userData.direccion}`,
          provincia: userData.provincia,
          codigoPostal: userData.codigoPostal,
          lat,
          lng,
          source,
          direccion_segura: true,
          owner_id: userId
        })

        if (dbError2) {
        setError(dbError2.message);
        setLoading(false);
        return;
      }

      // redirigir al login 
      navigate("/login");
    } catch (err) {
      setError("Ocurrió un error inesperado.");
      console.error(err);
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
          {/* Nombre y Apellido */}
          <input
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          />
          <input
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          />

          {/* Fecha de nacimiento */}
          <div className="md:col-span-2 flex flex-col">
            <label className="text-sm text-white mb-1">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
              required
            />
          </div>

          {/* tipo y num de documento */}
          <select
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          >
            <option value="">Seleccionar tipo de documento</option>
            <option value="DNI">DNI</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="CUIL">CUIL</option>
          </select>

          <input
            name="documento"
            placeholder="Número de documento"
            value={formData.documento}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          />

          {/* tel y mail */}
          <input
            name="telefono"
            placeholder="Código de área y número. Solo números."
            value={formData.telefono}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          />

          {/* direccion */}
          <input
            name="direccion"
            placeholder="Dirección"
            value={formData.direccion}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full md:col-span-2 focus:outline-none"
            required
          />

          {/* provincia y codpostal */}
          <select
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
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
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          />

          {/* password */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full md:col-span-2 focus:outline-none"
            required
          />
        </div>

        {/* Error */}
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
