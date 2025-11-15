// src/pages/Maps.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useSavedData } from "../context/SavedDataContext";
import { supabase } from "../services/supabase";
import ModalAlert from "../components/modals/ModalAlert";
import BtnPetFound from "../components/ui/BtnPetFound";
import BtnScreenshot from "../components/ui/BtnScreenshot";
import html2canvas from "html2canvas";
import emailjs from "@emailjs/browser";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Centrar mapa cuando cambia la ubicación
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function Maps() {
  const { 
    selectedPet, 
    location, 
    stopSimulation,
    setAlertOn,
  } = useSavedData();

  const [petPosition, setPetPosition] = useState(null);
  const [found, setFound] = useState(false);

  // Actualiza la posición que recibe del GPS simulado
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setPetPosition({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  if (!selectedPet) return <div>Seleccione una mascota para ver en el mapa</div>;
  if (!petPosition) return <div>Cargando ubicación...</div>;

  const { nombre, chip_id } = selectedPet;
  const chipActivo = !!chip_id;
  const address = `${location.direccion}, ${location.codigopostal} - ${location.provincia}`;

  // --------------------------------------
  // BOTÓN "ENCONTRÉ A MI MASCOTA"
  // --------------------------------------
  const handleFoundPet = () => {
    stopSimulation();
    setAlertOn(false);
    setFound(true);
  };

  // --------------------------------------
  // BOTÓN "ENVIAR CAPTURA"
  // --------------------------------------
  const handleSendScreenshot = async () => {
    try {
      // Capturar contenedor del mapa
      const mapElement = document.querySelector(".leaflet-container");
      const canvas = await html2canvas(mapElement);
      const imageBase64 = canvas.toDataURL("image/png");

      // Obtener email real del usuario logueado
      const { data } = await supabase.auth.getUser();
      const userEmail = data?.user?.email;

      if (!userEmail) {
        alert("❌ No hay un usuario autenticado.");
        return;
      }

      // Enviar email con EmailJS
      await emailjs.send(
        "service_b4i1idl",
        "template_mpbgcui",
        {
  
          pet_name: selectedPet.nombre,
          address: address,
          screenshot: imageBase64,
        },
        "YLjoPbSLIq24dKE8j"
      );

      alert("📸 Captura enviada exitosamente");

    } catch (err) {
      console.error("Error enviando captura:", err);
      alert("❌ Error al enviar captura");
    }
  };

  return (
    <div className="relative max-h-full h-screen w-full flex flex-col">
      {!found && <ModalAlert location={location} pet={selectedPet} />}

      <div className="flex-1 z-0">
        <MapContainer
          center={[petPosition.lat, petPosition.lng]}
          zoom={15}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <ChangeView center={[petPosition.lat, petPosition.lng]} />

          <Marker position={[petPosition.lat, petPosition.lng]}>
            <Popup>
              <strong>{nombre}</strong> 🐾<br />
              {address}<br />
              {location.segura ? "Zona segura ✅" : "Fuera de zona segura ⚠️"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="absolute right-0 z-20 w-1/3 bg-[#22687B]/50 p-5 shadow-md flex flex-col justify-center gap-4 rounded-b-lg">
        <h2 className="text-2xl text-white font-semibold">{nombre}</h2>

        <p className="text-xl text-white">
          Última ubicación: <span className="font-medium">{address}</span>
        </p>

        <span
          className={`px-3 py-1 rounded-lg text-white font-light ${
            chipActivo ? "bg-[#007bff]" : "bg-red-400"
          }`}
        >
          Chip: {chipActivo ? "Activo" : "Inactivo"}
        </span>

        {/* Botón para enviar captura */}
        <BtnScreenshot onClick={handleSendScreenshot} />

        {/* Botón "Encontré a mi mascota" */}
        {!found && <BtnPetFound onClick={handleFoundPet} />}
      </div>
    </div>
  );
}
