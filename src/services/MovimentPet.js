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
            update_at: new Date(),
        })
        .eq("mascota_id", petId);

    if(error) throw new Error("Erro en la actualización del pet: " + error.message)

}

// Simulación normal de hasta 8km de rayo del dueno
export async function simulateNormalMove(pet, userLocation, onAlert){
    const { lat, lng } = generateRandomCoords(userLocation.lat, userLocation.lng, 8);

    const simulated = {
        ...userLocation,
        lat,
        lng,
    };

    await updatePetLocation(pet.id, simulated);

    if(onAlert){
        onAlert({
            type: "normal",
            color: "#22687c",
            title: `${pet.nombre} se está moviendo`,
            message: "Movimiento dentro de la zona de sus 8km",
            button: `Ubique donde está ${pet.nombre}`,
            redirect: "/maps"
        })
    }

    return simulated;
}

// Simulación de emergencia > a 8km

export async function simulateEmergency(pet, userLocation, onAlert){
    const { lat, lng } = generateRandomCoords(userLocation.lat, userLocation.lng, 15);

    const simulated = {
        ...userLocation,
        lat, 
        lng
    };

    await updatePetLocation(pet.id, simulated);

    if(onAlert){
        onAlert({
            type: "emergency",
            color: "#f7612a",
            title: `Estamos Alertando que su mascota ${pet.nombre} está afuera de su ubicación`,
            message: "El pet ha salido de la zona de seguridad estipulado por usted, por favor verifique y siga sus pasitos.",
            button: `Vea su pet ${pet.nombre}`,
            redirect: "/maps",
        });
    }

    return simulated;
}

// Simulación de paseo con la mascota hasta 2km
export async function simulatedPaseo(pet, userLocation, onAlert){
    const { lat, lng } = generateRandomCoords(userLocation.lat, userLocation.lng, 2);

    const simulated = {
        ...userLocation,
        lat,
        lng,
    };

    await updatePetLocation(pet.id, simulated);

    if(onAlert){
        onAlert({
            type: "paseo",
            color: "#22687C",
            title: `Paseo de ${pet.nombre}`,
            message: "El pet está disfrutando su paseo cerca de casa.",
            button: `Mascote ${pet.nombre} está seguro`,
            redirect: "/maps",
        })
    }

    return simulated;
}