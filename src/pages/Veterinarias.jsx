import React from "react";

const veterinarias = [
  {
    id: 1,
    nombre: "Centro Médico Veterinario Buenos Aires",
    direccion: "Av. Boedo 840, C1228 Cdad. Autónoma de Buenos Aires",
    telefono: "011 4931-4425",
    imagen: "/src/assets/veterinaria-1.png",
    link: "https://www.instagram.com/centrovetbuenosaires/",
  },
  {
    id: 2,
    nombre: "CAVI Clínica Veterinaria",
    direccion: "Av. La Plata 402, C1235 Cdad. Autónoma de Buenos Aires",
    telefono: "3533-8108",
    imagen: "/src/assets/veterinaria-2.png",
    link: "https://cavi.com.ar/",
  },
  {
    id: 3,
    nombre: "Veterinaria UCIcoop",
    direccion: "Av. José María Moreno 635, C1424AAG Cdad. Autónoma de Buenos Aires",
    telefono: "011 4924-0026",
    imagen: "/src/assets/veterinaria-3.png",
    link: "https://www.instagram.com/ucicoop/",
  },
  {
    id: 4,
    nombre: "Veterinaria Panda",
    direccion: "Ave. Ruiz Huidobro 4771, C1430 Cdad. Autónoma de Buenos Aires",
    telefono: "011 5263-0176",
    imagen: "/src/assets/veterinaria-4.png",
    link: "https://medicinaintegral.veterinariapanda.com.ar/",
  },
  {
    id: 5,
    nombre: "Veterinaria del Libertador",
    direccion: "Blanco Encalada 1420, C1428 Cdad. Autónoma de Buenos Aires",
    telefono: "4788-0888",
    imagen: "/src/assets/veterinaria-5.png",
    link: "https://www.instagram.com/veterinarialibertador/",
  },
  {
    id: 6,
    nombre: "Clínica Veterinaria Cilap",
    direccion: "Av. Angel Gallardo 75, C1405 Cdad. Autónoma de Buenos Aires",
    telefono: "011 3137-0132",
    imagen: "/src/assets/veterinaria-6.png",
    link: "https://www.instagram.com/clinicaveterinariacilap/",
  },
  {
    id: 7,
    nombre: "Centro Asistencial Veterinario San Marcos",
    direccion: "Av. Díaz Vélez 4730, C1405 Cdad. Autónoma de Buenos Aires",
    telefono: "011 4981-1873",
    imagen: "/src/assets/veterinaria-7.png",
    link: "https://cavsanmarcos.com/",
  },
];

export default function Veterinaria() {
  return (
    <div className="min-h-screen bg-[#F7F9F9] py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-[#3D8E88] mb-10">
        Veterinarias 24 hrs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {veterinarias.map((vet) => (
          <div
            key={vet.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={vet.imagen}
              alt={vet.nombre}
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#3D8E88] mb-2">
                {vet.nombre}
              </h2>
              <p className="text-gray-700 mb-1">
                <span className="font-medium">Dirección:</span> {vet.direccion}
              </p>
              <p className="text-gray-700 mb-3">
                <span className="font-medium">Teléfono:</span> {vet.telefono}
              </p>
              <a
                href={vet.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-4 py-2 text-[#3D8E88] border border-[#3D8E88] rounded hover:bg-[#32726b] hover:text-white transition-all duration-200"
              >
                Ver más
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
