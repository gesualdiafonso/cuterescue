import React, { useState } from "react";
import Logo from "../assets/logo.png";
import LogoNombre from "../assets/logo-2.png";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Veterinarias 24hrs", path: "/veterinarias-24-hrs" },
    { name: "Documentación", path: "/documentacion" },
    { name: "Eventos", path: "/eventos" },
  ];

  return (
    <nav className="bg-navbar">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">

            <div className="flex">

              <img className="h-30 w-auto" src={Logo} alt="Logo" />
              <img className="h-35 w-auto" src={LogoNombre} alt="Logo" />

            </div>
        </Link>

        {/* Menú escritorio */}
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
                        : "text-[#22687B] hover:bg-white  rounded-lg hover:text-[#22687B] "
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Botones desktop */}
          <div className="ml-6 flex space-x-2">
            <Link to="/ingresar">
              <button className="btn-outline">Ingresar</button>
            </Link>
            <Link to="/registrar">
              <button className="btn">Registrarte</button>
            </Link>
          </div>
        </div>

        {/* Botón menú móvil */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[#22687B] focus:outline-none"
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

      {/* Menú móvil */}
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
