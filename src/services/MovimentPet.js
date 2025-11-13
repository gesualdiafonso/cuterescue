import { getAddressFromCoordinates } from "./GeoAPI";
import { supabase } from "./supabase";

// Funcion auxiliar: genera coordenadas radom adentro de un rayo km
function generateRandomCoords(lat, lng, radiuKm){
    const r = radiuKm/ 111; // 1° lat aprox 111km
    const u = Math.random();
    const v = Math.random();
    const w = r * Math.sqrt(u);
    const t = 2 * Math.PI * v;
    const latOffset = w * Math.cos(t);
    const lngOffset = w * Math.sin(t) / Math.cos(lat * (Math.PI / 180));

    return {
        lat: lat + latOffset,
        lng: lng + lngOffset
    }
}

// Actulizar en la supabase la nueva localización del pet
async function updatePetLocation(petId, newLocation){
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

    if(error) throw new Error("Erro en la actualización del pet: " + error.message)

}

// Función para pegar ubicación completo
async function locationData(lat, lng){
    const fullAddress = await getAddressFromCoordinates(lat, lng);

    if(!fullAddress) throw Error("Erro de cargar informaciones");

    const parts = fullAddress.split(", ").map(p => p.trim());

    const provincia = parts[parts.length - 3];

    const codigoPostal = parts.find(p => /\d{4,5}/.test(p));

    return {
        direccion: parts.slice(0, parts.length - 3).join(", "),
        codigoPostal,
        provincia,
    };
}


// Simulación normal de hasta 8km de rayo del dueno
export async function simulateNormalMove(pet, userLocation, onAlert){
    const { lat, lng } = generateRandomCoords(userLocation.lat, userLocation.lng, 1);

    const addressData = await locationData(lat, lng);

    const simulated = {
        ...userLocation,
        lat,
        lng,
        ...addressData
    };

    await updatePetLocation(pet.id, simulated);

    if(onAlert){
        onAlert({
            type: "normal",
            color: "#22687c",
            title: `${pet.nombre} se está moviendo`,
            message: `Movimiento dentro de la zona de sus 8km.\n\n --> Dirección actual:\n${simulated.direccion}\n${simulated.codigoPostal} - ${simulated.provincia}`,
            button: `Ubique donde está ${pet.nombre}`,
            redirect: "/maps"
        })
    }

    return simulated;
}

// Simulación de emergencia > a 8km

export async function simulateEmergency(pet, userLocation, onAlert){
    const { lat, lng } = generateRandomCoords(userLocation.lat, userLocation.lng, 4);

    const addressData = await locationData(lat, lng);

    const simulated = {
        ...userLocation,
        lat, 
        lng,
        ...addressData
    };

    await updatePetLocation(pet.id, simulated);

    if(onAlert){
        onAlert({
            type: "emergency",
            color: "#f7612a",
            title: `Estamos alertando que su mascota ${pet.nombre} está afuera de su ubicación`,
            message: `La mascota ha salido de la zona de seguridad estipulada.\n\n --> Nueva ubicación:\n${simulated.direccion}\n${simulated.codigoPostal} - ${simulated.provincia}`,
            button: `Vea a su mascota ${pet.nombre}`,
            redirect: "/maps",
        });
    }

    return simulated;
}

// Simulación de paseo con la mascota hasta 2km
export async function simulatedPaseo(pet, userLocation, onAlert){
    const { lat, lng } = generateRandomCoords(userLocation.lat, userLocation.lng, 2);

    const addressData = await locationData(lat, lng);

    const simulated = {
        ...userLocation,
        lat,
        lng,
        ...addressData
    };

    await updatePetLocation(pet.id, simulated);

    if(onAlert){
        onAlert({
            type: "paseo",
            color: "#22687C",
            title: `Paseo de ${pet.nombre}`,
            message: `El pet está disfrutando su paseo cerca de casa.\n\n --> Dirección:\n${simulated.direccion}\n${simulated.codigoPostal} - ${simulated.provincia}`,
            button: `Mascote ${pet.nombre} está seguro`,
            redirect: "/maps",
        })
    }

    return simulated;
}

// 🛰️ Simulação de movimento contínuo
export async function startRealTimeSimulation(pet, userLocation, type = "normal", onAlert) {
  let interval;
  const radiusMap = {
    normal: 1, // km
    paseo: 2,
    emergency: 4,
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

  const radius = radiusMap[type] || 1;
  const color = colorMap[type];
  const baseMessage = messageMap[type];

  interval = setInterval(async () => {
    const { lat, lng } = generateRandomCoords(userLocation.lat, userLocation.lng, radius);
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
  }, 4000); // atualiza a cada 4 segundos

  return () => clearInterval(interval); // função para parar a simulação
}
