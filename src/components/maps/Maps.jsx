import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { useSavedData } from "../../context/SavedDataContext";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function Maps({ modalOpen }) {
  const { selectedPet, location } = useSavedData();
  const [petPosition, setPetPosition] = useState(null);

  useEffect(() => {
    if (location?.lat && location?.lng) {
      setPetPosition({ lat: location.lat, lng: location.lng });
    }
  }, [location]);

  

  if (!selectedPet)
    return (
      <div className="w-full h-96 flex items-center justify-center text-white text-3xl font-bold bg-amber-400 rounded-2xl">
        Todavía no hay una mascota seleccionada
      </div>
    );

  if (!petPosition)
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500 bg-gray-100 rounded-2xl">
        Cargando ubicación...
      </div>
    );

  return (
    <div className={`w-full h-[500px] rounded-2xl overflow-hidden shadow ${modalOpen ? "pointer-events-none z-0" : "z-10"}`}>
      <MapContainer
        center={[petPosition.lat, petPosition.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        dragging={!modalOpen}
        scrollWheelZoom={!modalOpen}
        doubleClickZoom={!modalOpen}
        touchZoom={!modalOpen}
        keyboard={!modalOpen}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[petPosition.lat, petPosition.lng]}>
          <Popup>
            <strong>{selectedPet.nombre}</strong> 🐾
          </Popup>
        </Marker>
        <ChangeView center={[petPosition.lat, petPosition.lng]} />
      </MapContainer>
    </div>
  );
}
