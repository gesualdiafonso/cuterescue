import { getAddressFromCoordinates } from "./GeoAPI";
import { supabase } from "./supabase";

/**
Genera coordenadas aleatorias cercanas a una ubicación base simulando un movimiento dentro de un radio determinado

 * @param {number} lat - latitud actual, punto de partida
 * @param {number} lng - longitud actual, punto de partida
 * @param {number} radiusKm - radio max de movimiento en km
 * @returns {{lat: number, lng: number}} nuevas coordenadas generadas
 */

//  genera coordenadas cerca de la anterior, movimiento suave
function generateRandomCoords(lat, lng, radiusKm) {
  // 1 km = 0.009 grados (aprox)
  const r = radiusKm / 111;
  const angle = Math.random() * 2 * Math.PI;
  const distance = Math.random() * r;

  const latOffset = distance * Math.cos(angle);
  const lngOffset =
    (distance * Math.sin(angle)) / Math.cos(lat * (Math.PI / 180));

  return {
    lat: lat + latOffset,
    lng: lng + lngOffset,
  };
}

/**
  Actualiza la ubicación de una mascota en la tabla "localizacion" 
  @async
  @param {string|number} petId - ID de la mascota en la db
  @param {{lat: number, lng: number, direccion?: string, codigoPostal?: string, provincia?: string}} newLocation
  objeto con los nuevos datos de ubicacion
 * @throws {error} Si ocurre un error al actualizar en supabase
 */

async function updatePetLocation(petId, newLocation) {
  const { lat, lng, direccion, codigoPostal, provincia } = newLocation;

  const { error } = await supabase
    .from("localizacion")
    .update({
      lat,
      lng,
      direccion,
      codigoPostal,
      provincia,
      updated_at: new Date(),
    })
    .eq("mascota_id", petId);

  if (error) throw new Error("Error actualizando ubicación: " + error.message);
}

// Obtiene dirección completa
async function locationData(lat, lng) {
  const fullAddress = await getAddressFromCoordinates(lat, lng);
  if (!fullAddress) throw new Error("Error obteniendo dirección");

  const parts = fullAddress.split(", ").map((p) => p.trim());
  const provincia = parts[parts.length - 3];
  const codigoPostal = parts.find((p) => /\d{4,5}/.test(p));

  return {
    direccion: parts.slice(0, parts.length - 3).join(", "),
    codigoPostal,
    provincia,
  };
}

/**
 * inicia una simulación en tiempo real del movimiento de una mascota
 - Genera coordenadas aleatorias alrededor de la ubicación del usuario
 - Actualiza la ubicación en supabase
 - Dispara una callback de alerta opcional con datos descriptivos
 *
 * @param {Object} pet - Mascota a simular
 * @param {number} pet.id - ID de la mascota
 * @param {string} pet.nombre - Nombre de la mascota
 */
// simulación  con control de stop
export function startRealTimeSimulation(
  pet,
  userLocation,
  type = "normal",
  onAlert
) {
  let interval;

  const radiusMap = {
    normal: 0.05, // 50m  movimiento realista
    paseo: 0.08, // 80m
    emergency: 0.2, // 200m
  };

  const colorMap = {
    normal: "#22687c",
    paseo: "#22687C",
    emergency: "#f7612a",
  };

  const messageMap = {
    normal: "Movimiento dentro de la zona de sus 8km.",
    paseo: "El pet está disfrutando su paseo cerca de casa.",
    emergency: "El pet ha salido de la zona de seguridad estipulada.",
  };

  const radius = radiusMap[type] || 0.05;
  const color = colorMap[type];
  const baseMessage = messageMap[type];

  interval = setInterval(async () => {
    try {
      const { lat, lng } = generateRandomCoords(
        userLocation.lat,
        userLocation.lng,
        radius
      );
      const addressData = await locationData(lat, lng);

      const simulated = {
        ...userLocation,
        lat,
        lng,
        ...addressData,
      };

      await updatePetLocation(pet.id, simulated);

      if (onAlert) {
        onAlert({
          type,
          color,
          title: `${pet.nombre} se está moviendo (${type})`,
          message: `${baseMessage}\n\n --> Dirección actual:\n${simulated.direccion}\n${simulated.codigoPostal} - ${simulated.provincia}`,
          button: `Ver ${pet.nombre}`,
          redirect: "/maps",
        });
      }
    } catch (err) {
      console.error("Error en simulación:", err);
    }
  }, 4000); // actualiza cada 4 segundos

  /**
   * Función para detener la simulación desde el frontend
   *
   */
  const stopSimulation = () => clearInterval(interval);

  return stopSimulation;
}
