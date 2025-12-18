import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import LogoNombre from "../assets/logo-2.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import PetLink from "./ui/PetLink";
import { useSavedData } from "../context/SavedDataContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);

  const { selectedPet, alertOn } = useSavedData();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Informe", path: "/informe" },
    { name: "Vet 24hrs", path: "/veterinarias-24-hrs" },
    { name: "Documentación", path: "/documentacion" },
    { name: "Eventos", path: "/eventos" },
  ];

  //  cargar alertas cuando hay user
  useEffect(() => {
    if (!user) {
      setAlerts([]);
      return;
    }

    fetchAlerts(user.id);
  }, [user]);

  const fetchAlerts = async (userId) => {
    const { data, error } = await supabase
      .from("notificaciones")
      .select(
        `id, mensaje, fecha_alerta, vista, documentacion:documentacion_id (alerta)`
      )
      .eq("user_id", userId)
      .order("fecha_alerta", { ascending: true });

    if (error) return;

    const today = new Date();
    const filtered = (data || []).filter(
      (n) =>
        new Date(n.fecha_alerta) <= today &&
        n.documentacion?.alerta === "Activo" &&
        n.vista === false
    );

    setAlerts(filtered);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const handleNotificationsClick = async () => {
    setNotificationsOpen(!notificationsOpen);

    if (notificationsOpen && alerts.length > 0) {
      const ids = alerts.map((a) => a.id);
      await supabase
        .from("notificaciones")
        .update({ vista: true })
        .in("id", ids);

      setAlerts([]);
    }
  };

  if (loading) return null; // agregar spinner a futuro !!! modificar

  return (
    <nav
      className={`${
        alertOn ? "bg-[#FBC68F]" : "bg-white"
      } relative z-[100] shadow`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 relative">
        {/* logo */}
        <Link to="/" className="flex items-center gap-2">
          <img className="h-30 w-auto" src={Logo} alt="Logo" />
          <img className="h-30 w-auto" src={LogoNombre} alt="Logo" />
        </Link>

        {/* menu centrado en desktop */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="flex flex-nowrap bg-[#22687B]/20 rounded-lg overflow-hidden text-lg p-2 gap-2">
            {menuItems.map((item) => (
              <li key={item.name} className="flex-shrink-0">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `px-5 py-2 transition-colors duration-300 ${
                      isActive
                        ? "bg-white text-[#22687B] rounded-lg border border-gray-400"
                        : "text-[#22687B] hover:bg-white rounded-lg hover:text-[#22687B]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* DERECHA: usuario logueado o no */}
        <div
          className={`flex items-center gap-2 z-[101] transition-all duration-300 ${
            isOpen
              ? "opacity-0 pointer-events-none"
              : "opacity-100 pointer-events-auto"
          }`}
        >
          {/* BOTONES LOGIN / REGISTRAR SI NO HAY USER (DESKTOP) */}
          {!user && (
            <div className="hidden lg:flex gap-2">
              <Link
                to="/login"
                className="px-4 py-2 bg-[#22687B] text-white font-semibold rounded-md shadow hover:bg-[#1c5563] transition"
              >
                Ingresar
              </Link>

              <Link
                to="/registrar"
                className="px-4 py-2 bg-white text-[#22687B] font-semibold rounded-md shadow border border-[#22687B] hover:bg-[#f0fafa] transition"
              >
                Registrarme
              </Link>
            </div>
          )}

          {/* PetLink mascota selccionada renderizada en navbar*/}
          {user && <PetLink pet={selectedPet} />}

          {/* notificaciones */}
          {user && (
            <div className="relative">
              <button
                onClick={handleNotificationsClick}
                className="relative text-[#22687B] cursor-pointer"
              >
                <FiBell size={24} />
                {alerts.length > 0 && (
                  <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                    {alerts.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-[150] p-2 border border-gray-200">
                  <span className="text-sm font-semibold text-[#22687B] border-b">
                    Notificaciones
                  </span>
                  {alerts.length === 0 ? (
                    <p className="text-gray-500 text-sm px-2">
                      No hay alertas por ahora 🐾
                    </p>
                  ) : (
                    <ul className="max-h-60 overflow-y-auto text-sm">
                      {alerts.map((alert) => (
                        <li
                          key={alert.id}
                          className="px-2 py-1 border-b last:border-none hover:bg-gray-100 rounded"
                        >
                          {alert.mensaje}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Perfil */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                className="w-25 not-[]:px-4 py-2 bg-white text-[#22687B] font-semibold rounded-md shadow hover:bg-[#f0fafa] transition cursor-pointer"
              >
                Mi Perfil
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-[150] border border-gray-200">
                  <ul className="flex flex-col">
                    <li>
                      <button
                        onClick={() => navigate("/detalles")}
                        className="block w-full text-left px-4 py-2 hover:bg-[#e6f2f2] transition text-[#22687B] font-medium"
                      >
                        Mi Cuenta
                      </button>
                    </li>
                    <li>
                      <Link to="/planes">
                        <button className="block w-full text-left px-4 py-2 hover:bg-[#e6f2f2] transition text-[#22687B] font-medium">
                          Mi Plan
                        </button>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-red-500 hover:bg-[#ffe5e5] font-medium transition"
                      >
                        Cerrar Sesión
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}

          {isOpen && (
            <div className="fixed inset-0 bg-black/20 z-[140] backdrop-blur-sm"></div>
          )}

          {/* Hamburguesa mobile */}
          <div className="relative z-[150] max-[976px]:block hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#22687B] focus:outline-none relative z-[150]"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* menu responsive en mobile  */}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-1/2 bg-[#f5f5dc] z-[130] max-[976px]:block hidden shadow-lg">
          <ul className="flex flex-col items-center justify-center h-full space-y-4 text-lg">
            {menuItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-5 py-2 rounded-full transition-colors duration-300 ${
                      isActive
                        ? "bg-white text-[#22687B]"
                        : "text-[#3D8E88] hover:bg-white hover:text-[#3D8E88]"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* LOGIN / REGISTRO EN MOBILE */}
            {!user && (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-5 py-2 bg-[#22687B] text-white rounded-full shadow"
                  >
                    Ingresar
                  </Link>
                </li>

                <li>
                  <Link
                    to="/registrar"
                    onClick={() => setIsOpen(false)}
                    className="block px-5 py-2 bg-white text-[#22687B] border border-[#22687B] rounded-full shadow"
                  >
                    Registrarme
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
