export function generateRandomOffset(lat, lng, maxDistanceMeters) {
    const R = 6371000
    const deltaLat = (Math.random() - 0.5) * 2 * (maxDistanceMeters / R) * (180 * Math.PI);
    const deltaLng = 
        (Math.random() - 0.5) * 2 * (maxDistanceMeters / (R * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);
    return {
        lat: lat + deltaLat,
        lng: lng + deltaLng,
    };
}