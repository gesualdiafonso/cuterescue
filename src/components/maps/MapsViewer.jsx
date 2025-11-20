import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

/**
 * muestra un mapa en miniatura con la ubicación actual de la mascota seleccionada
 * 
 *  se usa en el dashboard e informe de mascota
 *   - muestra un mapa centrado en la mascota seleccionada
 *   - Indica su última ubicación
 *   - Seguir en tiempo real la posición mediante flyTo()
 
 * utilizando:
 *   - react Leaflet para map rendering
 *   - leaflet para markers e iconos
 *
 * @param {Object} selectedPet  mascota seleccionada 
 * @param {Object} location  ubicacion realtime proveniente del context saveddatacontext
 * @param {number} location.lat  coords Lat de la mascota
 * @param {number} location.lng  coords Long ''
 * @param {string} [location.direccion] - texto de la direc
 *
 */

// Icono default del gps
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

//  para mover el mapa cuando la ubicacion cambia
function ChangeView({ center }) {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function MapsViewer({ selectedPet, location }) {
  if (!selectedPet)
    return (
      <div className="w-full bg-amber-400 h-96 mb-5 rounded-2xl flex items-center justify-center text-white text-5xl font-black">
        Seleccione una mascota
      </div>
    );

  if (!location?.lat || !location?.lng)
    return (
      <div className="w-full bg-gray-100 h-96 mb-5 rounded-2xl flex items-center justify-center text-gray-500">
        Cargando ubicación...
      </div>
    );

  const position = [location.lat, location.lng];

  return (
    <div className="w-full bg-gray-100 h-96 mb-5 rounded-2xl overflow-hidden shadow ">
      <MapContainer 
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%", }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <strong>{selectedPet.nombre}</strong> 🐾
            <br />
            Última ubicación: <br />
            {location.direccion}
          </Popup>
        </Marker>
        <ChangeView center={position} />
      </MapContainer>
    </div>
  );
}
