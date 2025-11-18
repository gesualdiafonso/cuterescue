/**
 * 🌎 Servicios para geocodificación y reversa de geocodificación
 * usando OpenStreetMap (Nominatim API).
 * 
 * Mejora:
 * - Normaliza "CABA" a "Ciudad Autónoma de Buenos Aires"
 * - Reintenta búsqueda sin código postal si la primera falla
 * - Devuelve fuente y control de errores más claros
 */

export async function getCoordinatesFromAddress({
  direccion,
  codigoPostal,
  provincia,
}) {
  try {
    const provinciaNormalizada =
      provincia === "CABA" ? "Ciudad Autónoma de Buenos Aires" : provincia;

    // 🧩 Intento principal con código postal
    let query = `${direccion}, ${codigoPostal}, ${provinciaNormalizada}, Argentina`;
    let encodedQuery = encodeURIComponent(query);

    let response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`
    );

    if (!response.ok) {
      throw new Error("Error al comunicarse con OpenStreetMap");
    }

    let data = await response.json();

    // 👉 Si falla, reintento sin código postal
    if (!data || data.length === 0) {
      console.warn("No se encontró con código postal. Reintentando sin él...");
      query = `${direccion}, ${provinciaNormalizada}, Argentina`;
      encodedQuery = encodeURIComponent(query);

      response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`
      );

      data = await response.json();
    }

    // 👉 Si sigue fallando, devolvemos null pero NO cancelamos el flujo
    if (!data || data.length === 0) {
      console.warn("Sin resultados para la dirección proporcionada.");
      return { lat: null, lng: null, source: "OSM:no_result" };
    }

    const { lat, lon } = data[0];

    return {
      lat: parseFloat(lat),
      lng: parseFloat(lon),
      source: "OSM:geocodificado",
    };
  } catch (err) {
    console.error("Error en la geocodificación:", err);
    return { lat: null, lng: null, source: "OSM:error" };
  }
}


/**
 * 📍 Reverse Geocoding: obtiene dirección textual a partir de coordenadas.
 * Útil para mostrar la dirección estimada del chip o simulador.
 */
export async function getAddressFromCoordinates(lat, lng) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );

    if (!response.ok) throw new Error("Falla al buscar dirección en OSM");

    const data = await response.json();
    return data.display_name || "Dirección no encontrada";
  } catch (err) {
    console.error("Error en la búsqueda inversa:", err);
    return null;
  }
}
