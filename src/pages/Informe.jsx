import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useSavedData } from "../context/SavedDataContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import SimulateGPS from "../utils/data/simulateGPS";

const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Informe() {
  const { location } = useSavedData();

  if (!location)
    return (
      <div className="w-full bg-gray-100 h-96 rounded-2xl flex items-center justify-center text-gray-500 text-xl">
        Cargando ubicación del GPS...
      </div>
    );

  const { lat, lng, direccion, updated_at } = location;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-3 text-gray-800">
        🐾 Seguimiento GPS 
      </h1>

      <div className="w-full h-96 rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          center={[lat, lng]}
          zoom={16}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lng]}>
            <Popup>
              📍 <strong>Ubicación actual</strong> <br />
              {direccion || "Sin dirección"} <br />
           <small>
  Última actualización:{" "}
  {new Date(
    new Date(updated_at).getTime() - 3 * 60 * 60 * 1000 // resto 3 hrs para horario arg, CORREGIR!!! 💥💥
  ).toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })}
</small>




            </Popup>
          </Marker>
        </MapContainer>
      </div>

        <div className="p-6">
      <SimulateGPS /> {/* simula movimiento cuando estoy en la pagina */}

    </div>
    </div>
  );
}
