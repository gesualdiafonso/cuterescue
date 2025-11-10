import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSavedData } from "../context/SavedDataContext";
import ModalAlert from "../components/modals/ModalAlert";
import { supabase } from "../services/supabase";


// Ícone padrão do Leaflet
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Move o mapa quando o centro muda
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.5 });
  }, [center, map]);
  return null;
}

export default function Maps() {
  const { selectedPet } = useSavedData();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca a última localização do pet
  useEffect(() => {
    const fetchLocation = async () => {
      if (!selectedPet?.id) return;

      const { data, error } = await supabase
        .from("localizacion")
        .select("*")
        .eq("mascota_id", selectedPet.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Erro ao buscar localização:", error.message);
      } else {
        setLocation(data);
      }

      setLoading(false);
    };

    fetchLocation();

    // opcional: escuta em tempo real atualizações da localização
    const subscription = supabase
      .channel("location_changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "localizacion" },
        (payload) => {
          if (payload.new.pet_id === selectedPet?.id) {
            setLocation(payload.new);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedPet]);

  if (!selectedPet)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Selecione um pet para ver no mapa
      </div>
    );

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Carregando localização...
      </div>
    );

  if (!location)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Nenhuma localização encontrada para este pet
      </div>
    );

  const { nombre, chip_id } = selectedPet;
  const chipActivo = !!chip_id;
  const { direccion, codigopostal, provincia, lat, lng, segura } = location;
  const position = [lat, lng];
  const address = `${direccion}, ${codigopostal} - ${provincia}`;

  return (
    <div className="relative max-h-full h-screen w-full flex flex-col">
      {/* Modal de alerta */}
      <ModalAlert location={location} pet={selectedPet} />

      {/* Mapa */}
      <div className="flex-1 z-0">
        <MapContainer
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={position} />
          <Marker position={position}>
            <Popup>
              <strong>{nombre}</strong> 🐾
              <br />
              {address}
              <br />
              {segura ? "Zona segura ✅" : "Fora da zona segura ⚠️"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Info lateral */}
      <div className="absolute right-0 z-20 w-1/3 bg-[#22687B]/50 p-5 shadow-md flex flex-col justify-center gap-4 rounded-b-lg ">
        <div>
          <h2 className="text-2xl text-white font-semibold">{nombre}</h2>
          <p className="text-xl text-white">
            Última localização: <span className="font-medium">{address}</span>
          </p>
        </div>
        <div className="flex gap-5 items-center">
          <span
            className={`px-3 py-1 rounded-lg text-white font-light ${
              chipActivo ? "bg-[#007bff]" : "bg-red-400"
            }`}
          >
            Chip: {chipActivo ? "Activo" : "Inactivo"}
          </span>
        </div>
      </div>
    </div>
  );
}
