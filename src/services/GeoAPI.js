/**
 * Servicios para geocodificacion y reversion de geocoding usando OpenStreetMap
 * Baseado en la API publica de: https://nominatim.openstreetmap.org
 */

export async function getCoordinatesFromAddress({
    direccion,
    codigo_postal,
    provincia,
}){
    try{
        // monto una query completa del enderezo que va a ser en Argentina PAIS FIJO
        const query = `${direccion}, ${codigo_postal}, ${provincia}, Argentina`;

        // codifico la URL para evitar el problema con espacio o acentos
        const encodedQuery = encodeURIComponent(query);

        // Hago el request para endpoint de geocode de OSM
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodedQuery}`
        );

        if (!response.ok){
            throw new Error("Eita poha, falhou aqui o OSM querido")
        }

        const data = await response.json();

        // Caso no encontre el resultado boludo
        if(!data || data.length === 0){
            return{ lat:null, lng:null, source: "OSM:no_result"};
        }

        // Pego el primer resultado (o mas relevante)
        const { lat, lon } = data[0];

        return{
            lat:parseFloat(lat),
            lng: parseFloat(lon),
            source: "OSM: geocodificado"
        }
    } catch(err){
        console.error("Erro na geocodificacao carinho: ", err);
        return
    }
}

/**
 * Reverse Geocodification - algo opcional (caso queria buscar ubicación por mapa)
 */

export async function getAddressFromCoordinates(lat, lng){
    try {
        const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        );

        if (!response.ok) throw new Error("Falha ao buscar endereço no OSM");

        const data = await response.json();
        return data.display_name || "Endereço não encontrado";
    } catch (err) {
        console.error("Erro no reverse geocoding:", err);
        return null;
    }
}