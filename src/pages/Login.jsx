import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";

export default function LogIn() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = formData;

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setError(loginError.message);
      setLoading(false);
      return;
    }

    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="m-10 flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="rounded-2xl shadow-lg p-8 w-full max-w-md bg-[#22687B]/90 backdrop-blur-md"
      >
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Cute Rescue
        </h2>
        <p className="text-white text-center mb-6">
          Ingresa tu correo y contraseña
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="nombre@mail.com"
            value={formData.email}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="********"
            value={formData.password}
            onChange={handleChange}
            className="bg-white text-black rounded-lg p-2 w-full focus:outline-none"
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
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="text-white text-center mt-4">
          <a href="#" className="underline hover:text-gray-200">
            Olvidaste tu contraseña?
          </a>
        </p>
      </form>
    </div>
  );
}
