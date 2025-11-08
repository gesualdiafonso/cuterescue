
let currentPet = null;
let subscribers = [];

// 🔹 Atualiza globalmente e notifica ouvintes
export function setSelectedPet(pet) {
  currentPet = pet;
  localStorage.setItem("selectedPet", JSON.stringify(pet));
  subscribers.forEach((cb) => cb(pet)); // notifica contextos/react hooks
}

// 🔹 Lê o pet atual
export function getSelectedPetService() {
  if (currentPet) return currentPet;
  const saved = localStorage.getItem("selectedPet");
  return saved ? JSON.parse(saved) : null;
}

// 🔹 Subscrever às mudanças globais (para Contexts)
export function subscribeSelectedPet(callback) {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((cb) => cb !== callback);
  };
}
