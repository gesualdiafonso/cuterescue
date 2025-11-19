import React, { useState, useRef } from "react";
import MapaVeterinaria from "../components/maps/MapaVeterinarias";
import AppH1 from "../components/ui/AppH1";

const veterinarias = [
  {
    id: 1,
    nombre: "Centro Médico Veterinario Buenos Aires",
    direccion: "Av. Boedo 840, C1228 Cdad. Autónoma de Buenos Aires",
    lat: -34.62246017340913, 
    lng: -58.41604893069148,
    telefono: "011 4931-4425",
    imagen: "/src/assets/images/veterinarias/veterinaria-1.png",
    link: "https://www.instagram.com/centrovetbuenosaires/",
  },
  {
    id: 2,
    nombre: "CAVI Clínica Veterinaria",
    direccion: "Av. La Plata 402, C1235 Cdad. Autónoma de Buenos Aires",
    lat: -34.61926456677184,
    lng: -58.4281911182422,
    telefono: "3533-8108",
    imagen: "/src/assets/images/veterinarias/veterinaria-2.png",
    link: "https://cavi.com.ar/",
  },
  {
    id: 3,
    nombre: "Veterinaria UCIcoop",
    direccion: "Av. José María Moreno 635, C1424AAG Cdad. Autónoma de Buenos Aires",
    lat: -34.62593787430421,
    lng: -58.434401116390696,
    telefono: "011 4924-0026",
    imagen: "/src/assets/images/veterinarias/veterinaria-3.png",
    link: "https://www.instagram.com/ucicoop/",
  },
  {
    id: 4,
    nombre: "Veterinaria Panda",
    direccion: "Ave. Ruiz Huidobro 4771, C1430 Cdad. Autónoma de Buenos Aires",
    lat: -34.554730831491426,
    lng: -58.49462365872152,
    telefono: "011 5263-0176",
    imagen: "/src/assets/images/veterinarias/veterinaria-4.png",
    link: "https://medicinaintegral.veterinariapanda.com.ar/",
  },
  {
    id: 5,
    nombre: "Veterinaria del Libertador",
    direccion: "Blanco Encalada 1420, C1428 Cdad. Autónoma de Buenos Aires",
    lat: -34.55333374807784,
    lng: -58.449358160572835,
    telefono: "4788-0888",
    imagen: "/src/assets/images/veterinarias/veterinaria-5.png",
    link: "https://www.instagram.com/veterinarialibertador/",
  },
  {
    id: 6,
    nombre: "Clínica Veterinaria Cilap",
    direccion: "Av. Angel Gallardo 75, C1405 Cdad. Autónoma de Buenos Aires",
    lat: -34.602468569611766,
    lng: -58.43363597221212,
    telefono: "011 3137-0132",
    imagen: "/src/assets/images/veterinarias/veterinaria-6.png",
    link: "https://www.instagram.com/clinicaveterinariacilap/",
  },
  {
    id: 7,
    nombre: "Centro Asistencial Veterinario San Marcos",
    direccion: "Av. Díaz Vélez 4730, C1405 Cdad. Autónoma de Buenos Aires",
    lat: -34.608735235472466,
    lng: -58.43343338940672,
    telefono: "011 4981-1873",
    imagen: "/src/assets/images/veterinarias/veterinaria-7.png",
    link: "https://cavsanmarcos.com/",
  },
];



export default function Veterinaria() {
    const [selectedVet, setSelectedVet] = useState(veterinarias[0]);

    const mapRef = useRef(null);

    const handleSelectVet = (vet) => {
        setSelectedVet(vet);

        //Scroll hasta el maps
        setTimeout(() => {
            mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 200);
    };

  return (
    <div className="min-h-screen bg-[#F7F9F9] py-10 px-6">
        <div className="flex justify-center" ref={mapRef}>
            <div className="max-w-7xl w-full z-10">
                <MapaVeterinaria 
                    lat={selectedVet.lat}
                    lng={selectedVet.lng}
                    nombre={selectedVet.nombre}
                />
            </div>
        </div>
   

      <AppH1 className="estilosH1 text-center">
  Veterinarias 24 hrs
</AppH1>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {veterinarias.map((vet) => (
          <div
            key={vet.id}
            onClick={() => handleSelectVet(vet)}
            className={`bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 ${selectedVet.id === vet.id ? "ring-2 ring-[#22687b]" : ""}`}
          >
            <img
              src={vet.imagen}
              alt={vet.nombre}
              className="w-full h-64 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-[#22687b] mb-2">
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
                className="inline-block mt-2 px-4 py-2 text-[#22687b] border border-[#22687b] rounded hover:bg-[#22687b] hover:text-white transition-all duration-200"
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