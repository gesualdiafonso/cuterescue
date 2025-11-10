import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Icono personalizado para la ubicación
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Maps({ selectedPet, location }) {
<<<<<<< HEAD
  if (!selectedPet) return <div className="bg-amber-400 rounded-2xl w-full max-w-56 flex justify-center items-center p-10 mx-auto text-shadow-indigo-50 text-center"><h2 className="text-white text-3xl font-black">Todavía no Hay pet en sus informes</h2></div>;
  if (!location) return <div>Carregando localização...</div>;
=======
  if (!selectedPet) return <div className="bg-amber-400 rounded-2xl w-full max-w-56 flex justify-center items-center p-10 mx-auto text-shadow-indigo-50 text-center"><h2 className="text-white text-3xl font-black">Todavía no registró una mascota</h2></div>;
  if (!location) return <div>Cargando ubicación...</div>;
>>>>>>> b0096ff (implementación de nuevas pages, componentes y services de otro repo cuterescue, edit/borrar mascota, user foto_url, dashboard responsive)

  const { nombre, activo } = selectedPet;
  const status = activo ? "Activo" : "Inactivo";
  const { direccion, codigoPostal, provincia, lat, lng } = location;

  return (
    <div className="w-1/2 h-auto">
      <article className="w-full bg-[#f5dcb3] p-5 rounded-3xl">
        <div className="flex gap-10">
          <div className="w-full flex flex-col">
            <h4>{nombre}</h4>
            <span>Última Localización: </span>
            <span>{direccion}</span>
          </div>
          <div className="">
            <span className="bg-[#71dd5b] text-white px-2 text-center rounded-lg font-light">{status}</span>
          </div>
        </div>
        <div className="w-full h-full bg-amber-100 rounded-2xl">
          <MapContainer
            center={[lat, lng]}
            zoom={15}
            style={{ height: "300px", width: "100%" }}
            scrollWheelZoom={true}
            className="rounded-2xl z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
              <Popup>
                <strong>{nombre}</strong> está aquí.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </article>
    </div>
  );
}
