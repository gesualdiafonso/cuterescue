import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { Card, Input, Button, Typography } from "@material-tailwind/react";

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

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Login exitoso: redirigir al dashboard o página principal
    navigate("/dashboard");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-bg">
      <div className="bg-orange-500 p-20 py-30 rounded-2xl shadow-lg">
        <Card color="transparent" shadow={false} className="text-center">
          <Typography variant="h4" color="white">
            Cute Rescue
          </Typography>
          <Typography color="white" className="mt-1 font-normal">
            Ingresa tu mail y contraseña
          </Typography>

          <form
            onSubmit={handleLogin}
            className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96 mx-auto"
          >
            <div className="mb-1 flex flex-col gap-6">
              <Typography variant="h6" color="white" className="-mb-3 text-left">
                Your Email
              </Typography>
              <Input
                name="email"
                size="lg"
                placeholder="nombre@mail.com"
                className="custom-input"
                value={formData.email}
                onChange={handleChange}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />

              <Typography variant="h6" color="white" className="-mb-3 text-left">
                Password
              </Typography>
              <Input
                type="password"
                name="password"
                size="lg"
                placeholder="********"
                className="custom-input"
                value={formData.password}
                onChange={handleChange}
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                required
              />
            </div>

            {error && (
              <Typography color="red" className="mt-4 text-center font-normal">
                {error}
              </Typography>
            )}

            <Button className="mt-6 btn-form-login" fullWidth type="submit">
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>

            <Typography color="white" className="mt-4 text-center font-normal">
              <a href="#" className="font-medium text-gray-900">
                Me olvidaste la contraseña
              </a>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
}
