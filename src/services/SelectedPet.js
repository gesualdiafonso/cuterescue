let currentPet = null;
let subscribers = [];

const VALID_PET_FIELDS = [
  "id",
  "owner_id",
  "nombre",
  "especie",
  "raza",
  "color",
  "sexo",
  "estado_salud",
  "peso",
  "fecha_nacimiento",
  "foto_url" 
];

// 🔹 Filtra la mascota y deja solo campos que existen en Supabase
function cleanPetForStorage(pet) {
  const cleaned = {};
  VALID_PET_FIELDS.forEach((key) => {
    if (pet[key] !== undefined) cleaned[key] = pet[key];
  });
  return cleaned;
}

// guarda selectedPet y notifica suscriptores
export function setSelectedPet(pet) {
  if (!pet) return;

  // filtrar antes de guardar
  const cleanedPet = cleanPetForStorage(pet);

  currentPet = cleanedPet;

  localStorage.setItem("selectedPet", JSON.stringify(cleanedPet));

  subscribers.forEach((cb) => cb(cleanedPet));
}

// obtiene la mascota seleccionada
export function getSelectedPetService() {
  if (currentPet) return currentPet;

  const saved = localStorage.getItem("selectedPet");
  return saved ? JSON.parse(saved) : null;
}

// subscripcion a cambios
export function subscribeSelectedPet(callback) {
  if (typeof callback !== "function") return () => {};
  subscribers.push(callback);

  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
}

//  reset si eliminamos mascota
export function clearSelectedPet() {
  currentPet = null;
  localStorage.removeItem("selectedPet");

  subscribers.forEach((cb) => cb(null));
}
