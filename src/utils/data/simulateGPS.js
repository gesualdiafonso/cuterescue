import { supabase } from "../../services/supabase";


export default function SimulateGPS() {
  const MASCOTA_ID = "dd1e7afc-c65c-4914-bde2-247b01ba0a85";

  async function simulateMovement() {
    // valores aleatorios alrededor de una ubicación base
    const baseLat = -34.6147; 
    const baseLng = -58.4324;
    const newLat = baseLat + (Math.random() - 0.5) * 0.002;
    const newLng = baseLng + (Math.random() - 0.5) * 0.002;

    const { error } = await supabase
      .from("localizacion")
      .update({
        lat: newLat,
        lng: newLng,
        updated_at: new Date().toISOString(),
      })
      .eq("mascota_id", MASCOTA_ID);

    if (error) console.error("❌ Error actualizando ubicación:", error.message);
    else console.log("📍 Ubicación simulada actualizada:", newLat, newLng);
  }

  // DESCOMENTAR PARA ACTIVAR GPS!!!! 💥💥💥💥💥💥
 //  setInterval(simulateMovement, 5000);

  return null;
}
