import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";
import LogoNombre from "../assets/logo-2.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { FiBell } from "react-icons/fi";
import PetLink from "./ui/PetLink";
import { useSavedData } from "../context/SavedDataContext";

export default function Navbar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const { selectedPet } = useSavedData();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Informe", path: "/informe" },
    { name: "Veterinarias 24hrs", path: "/veterinarias-24-hrs" },
    { name: "Documentación", path: "/documentacion" },
    { name: "Eventos", path: "/eventos" },
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setUser(data.session.user);
        fetchAlerts(data.session.user.id);
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) fetchAlerts(session.user.id);
      else setAlerts([]);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

const fetchAlerts = async (userId) => {
  // genero un join con la tabla documentacion para ver si esa ficha tiene alerta = 'activo'
  const { data, error } = await supabase
    .from("notificaciones")
    .select(`
      id,
      mensaje,
      fecha_alerta,
      vista,
      documentacion:documentacion_id (alerta)
    `)
    .eq("user_id", userId)
    .order("fecha_alerta", { ascending: true });

  if (error) {
    console.error("Error cargando notificaciones:", error);
    return;
  }

  const today = new Date();

  // Filtra solo las que ya deben mostrarse y cuya documentación esté activa
  const filtered = (data || []).filter(
    (n) =>
      new Date(n.fecha_alerta) <= today &&
      n.documentacion?.alerta === "Activo" &&
      n.vista === false
  );

  setAlerts(filtered);
};

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const handleNotificationsClick = async () => {
    setNotificationsOpen(!notificationsOpen);

    if (notificationsOpen && alerts.length > 0) {
      const ids = alerts.map(a => a.id);
      await supabase.from("notificaciones").update({ vista: true }).in("id", ids);
      setAlerts([]);
    }
  };

  return (
    <nav className="bg-navbar">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          <div className="flex">
            <img className="h-30 w-auto" src={Logo} alt="Logo" />
            <img className="h-35 w-auto" src={LogoNombre} alt="Logo" />
          </div>
        </Link>

        <div className="hidden md:flex md:items-center md:space-x-6">
          <ul className="flex bg-[#22687B]/20 rounded-lg overflow-hidden text-lg p-2">
            {menuItems.map((item) => (
              <li key={item.name}>
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
            
          {!user ? (
            <>
              <Link to="/login">
                <button className="btn-outline">Ingresar</button>
              </Link>
              <Link to="/registrar">
                <button className="btn ml-2">Registrarte</button>
              </Link>
            </>
          ) : (
            <div className="ml-6 relative flex items-center space-x-4">
              <PetLink pet={selectedPet} />
              <div className="relative">
                <button
                  onClick={handleNotificationsClick}
                  className="relative text-[#22687B] focus:outline-none"
                >
                  <FiBell size={24} />
                  {alerts.length > 0 && (
                    <span className="absolute -top-2 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5">
                      {alerts.length}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-lg shadow-lg z-20 p-2">
                    <h3 className="text-sm font-semibold text-[#22687B] border-b pb-1 mb-2">
                      Notificaciones
                    </h3>
                    {alerts.length === 0 ? (
                      <p className="text-gray-500 text-sm px-2">No hay alertas por ahora 🐾</p>
                    ) : (
                      <ul className="max-h-60 overflow-y-auto text-sm">
                        {alerts
                          .filter(a => new Date(a.fecha_alerta) <= new Date())
                          .map((alert) => (
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

          <div className="relative">
  <button
    onClick={() => {
      setProfileOpen(!profileOpen);
      setNotificationsOpen(false);
    }}
    className="px-4 py-2 bg-white text-[#22687B] font-semibold rounded-md shadow hover:bg-[#f0fafa] transition"
  >
    Mi Perfil
  </button>

  {profileOpen && (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
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
               <Link to="/planes"> <button className="block w-full text-left px-4 py-2 hover:bg-[#e6f2f2] transition text-[#22687B] font-medium">
            Mi Plan
          </button></Link>
        </li>
        <li>
          <button className="block w-full text-left px-4 py-2 hover:bg-[#e6f2f2] transition text-[#22687B] font-medium">
            Agregar Mascota
          </button>
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

            </div>
          )}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-[#22687B] focus:outline-none">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden mt-2 space-y-2 bg-[#f5f5dc] p-4 rounded-lg">
          <ul className="space-y-2 text-lg">
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
          </ul>
        </div>
      )}
    </nav>
  );
}
