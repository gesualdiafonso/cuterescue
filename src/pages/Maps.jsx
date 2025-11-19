import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useSavedData } from "../context/SavedDataContext";
import { supabase } from "../services/supabase";
import ModalAlert from "../components/modals/ModalAlert";
import BtnPetFound from "../components/ui/BtnPetFound";
import BtnScreenshot from "../components/ui/BtnScreenshot";
import emailjs from "@emailjs/browser";
import ModalMailCaptura from "../components/modals/ModalMailCaptura";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Centrar mapa cuando cambia la ubicacion
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function Maps() {
  const { selectedPet, location, stopSimulation, setAlertOn } = useSavedData();

  const [petPosition, setPetPosition] = useState(null);
  const [found, setFound] = useState(false);
  const [showMailModal, setShowMailModal] = useState(false);


  // updatea posición que recibe del GPS simulado
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setPetPosition({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  if (!selectedPet) return <div>Seleccione una mascota para ver en el mapa</div>;
  if (!petPosition) return <div>Cargando ubicación...</div>;

  const { nombre, chip_id } = selectedPet;
  const chipActivo = !!chip_id;

  // Defino safeAddress a nivel del componente para usar en JSX y funciones
  const safeAddress = [
    location?.direccion,
    location?.barrio,
    location?.ciudad,
    location?.provincia,
    location?.codigoPostal || location?.codigopostal,
  ].filter(Boolean).join(", ");

  // BOTÓN "ENCONTRÉ A MI MASCOTA"
  const handleFoundPet = () => {
    stopSimulation();
    setAlertOn(false);
    setFound(true);
  };

  // BOTÓN "ENVIAR CAPTURA"
  const handleSendScreenshot = async () => {
    try {
      if (!petPosition) {
        alert("❌ No hay posición de la mascota disponible.");
        return;
      }

      // Obtener usuario autenticado
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("❌ No hay un usuario autenticado.");
        return;
      }
      const userEmail = userData.user.email;

      // Crear link de Google Maps
      const lat = petPosition.lat;
      const lng = petPosition.lng;
      const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

      // Enviar email con EmailJS
      await emailjs.send(
        "service_b4i1idl",
        "template_mpbgcui",
        {
          to_email: userEmail,
          pet_name: selectedPet.nombre,
          address: safeAddress,
          screenshot_url: googleMapsLink,
        },
        "YLjoPbSLIq24dKE8j"
      );

      setShowMailModal(true);

    } catch (err) {
      console.error("🔥 ERROR FINAL:", err);
      alert("❌ Error al enviar ubicación");
    }
  };
     <div className="flex-1 z-20">
  {showMailModal && (
    <ModalMailCaptura onClose={() => setShowMailModal(false)} />
  )}


</div>

return (
  <div className="relative max-h-full h-screen w-full flex flex-col">

    {/*  ALERTA DE EMERGENCIA  si no la encuentra */}
    {!found && <ModalAlert location={location} pet={selectedPet} />}

    {/*  MODAL DE MAIL  */}
    {showMailModal && (
      <ModalMailCaptura onClose={() => setShowMailModal(false)} />
    )}

    {/*  MAPA */}
    <div className="flex-1 z-20">
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
            {safeAddress}<br />
            {location.segura ? "Zona segura ✅" : "Fuera de zona segura ⚠️"}
          </Popup>
        </Marker>
      </MapContainer>
    </div>

    {/* PANEL LATERAL */}
    <div className="absolute right-0 z-20 w-1/3 bg-[#22687B]/50 p-5 shadow-md flex flex-col justify-center gap-4 rounded-b-lg">

      <h2 className="text-2xl text-white font-semibold">{nombre}</h2>

      <p className="text-xl text-white">
        Última ubicación: <span className="font-medium">{safeAddress}</span>
      </p>

      <span
        className={`px-3 py-1 rounded-lg text-white font-light ${
          chipActivo ? "bg-[#007bff]" : "bg-red-400"
        }`}
      >
        Chip: {chipActivo ? "Activo" : "Inactivo"}
      </span>

      {/*  Botón para enviar captura */}
      <BtnScreenshot onClick={handleSendScreenshot} />

      {/*  Botón "Encontré a mi mascota" */}
      {!found && <BtnPetFound onClick={handleFoundPet} />}
    </div>

  </div>
);

}
