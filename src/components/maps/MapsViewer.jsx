import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Componente encargado de mostrar visualmente en el mapa la ubicación de una mascota !!!!
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Componente interno para mover o mapa quando o pet muda
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function MapsViewer({ selectedPet, location }) {
  const [mapReady, setMapReady] = useState(false);

  // Se não houver pet selecionado
  if (!selectedPet)
    return (
      <div className="w-full bg-amber-400 h-96 mb-5 rounded-2xl flex items-center justify-center text-white text-5xl font-black">
        Todavía no hay un Pet
      </div>
    );

  // Se ainda não carregou localização
  if (!location || !location.lat || !location.lng)
    return (
      <div className="w-full bg-gray-100 h-96 mb-5 rounded-2xl flex items-center justify-center text-gray-500">
        Cargando ubicación...
      </div>
    );

  const { nombre } = selectedPet;
  const { lat, lng, direccion, codigoPostal, provincia } = location;
  const position = [lat, lng];

  return (
    <div className="w-full bg-gray-100 h-96 mb-5 rounded-2xl overflow-hidden shadow">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        whenReady={() => setMapReady(true)}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mapReady && <ChangeView center={position} />}
        <Marker position={position}>
          <Popup>
            <strong>{nombre}</strong> 🐾
            <br />
            Última ubicación: <br />
            {direccion}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
