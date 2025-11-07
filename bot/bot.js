import TelegramBot from "node-telegram-bot-api";
import axios from "axios";
import { generateRandomOffset } from "../lib/utils/geoUtils.js";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "TU_TOKEN_AQUI";
const API_URL = "http://localhost:5000/api";
let selectedChip = null; // 🔹 Chip seleccionado por el usuario

const bot = new TelegramBot(TOKEN, { polling: true });

// Lugares simulados
const lugares = {
  casa: {
    address: "Avenida Corrientes 1922, Balvanera, CABA",
    lat: -34.6045,
    lng: -58.3938,
    number: 1922,
    barrio: "Balvanera",
    ciudad: "Buenos Aires",
  },
  petshop: {
    address: "Avenida Las Heras 1632, Recoleta, CABA",
    lat: -34.5873,
    lng: -58.3962,
    number: 1632,
    barrio: "Recoleta",
    ciudad: "Buenos Aires",
  },
};

// ==========================================
// 📍 1️⃣ Listar chips disponibles
// ==========================================
bot.onText(/\/chips/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    const { data } = await axios.get(`${API_URL}/chips`);
    if (!data || data.length === 0)
      return bot.sendMessage(chatId, "⚠️ No se encontraron chips.");

    const lista = data
      .map((chip, i) => `${i + 1}. ${chip.id} — Mascota: ${chip.pet_id}`)
      .join("\n");

    bot.sendMessage(
      chatId,
      `🔹 Chips disponibles:\n${lista}\n\nUsa /selectchip <id> para elegir uno.`
    );
  } catch (error) {
    console.error("Error al obtener chips:", error.message);
    bot.sendMessage(chatId, "❌ Error al obtener chips del servidor.");
  }
});

// ==========================================
// 🧭 2️⃣ Seleccionar chip activo
// ==========================================
bot.onText(/\/selectchip (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const chipId = match[1].trim();

  try {
    const { data } = await axios.get(`${API_URL}/chips/${chipId}`);
    if (!data) return bot.sendMessage(chatId, "❌ Chip no encontrado.");

    selectedChip = data.id;
    bot.sendMessage(chatId, `✅ Chip seleccionado: ${selectedChip}`);
  } catch (error) {
    bot.sendMessage(chatId, "❌ Error al seleccionar chip. Verifica el ID.");
  }
});

// ==========================================
// 🚀 3️⃣ Actualizar ubicación manual
// ==========================================
bot.onText(/\/updateLocation (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;

  if (!selectedChip)
    return bot.sendMessage(chatId, "⚠️ Primero selecciona un chip con /selectchip <id>");

  const destino = match[1].toLowerCase();
  const location = lugares[destino];

  if (!location)
    return bot.sendMessage(chatId, "Lugar inválido. Usa /updateLocation casa o /updateLocation petshop");

  try {
    await axios.put(`${API_URL}/locations/${selectedChip}`, {
      ...location,
      source: "telegram_bot",
      movement_detected: destino === "petshop",
    });

    bot.sendMessage(chatId, `✅ Ubicación actualizada a ${location.address} (${selectedChip})`);
  } catch (error) {
    console.error("Error:", error.message);
    bot.sendMessage(chatId, "❌ Error al enviar ubicación.");
  }
});

// ==========================================
// ⏱️ 4️⃣ Simulación manual
// ==========================================
bot.onText(/\/simulate (escape|walk|last)/, (msg, match) => {
  const tipo = match[1];
  if (tipo === "escape") simulateEmergencyEscape();
  else if (tipo === "walk") simulateWalkingPet();
  else if (tipo === "last") simulateLastMovement();

  bot.sendMessage(msg.chat.id, `🚀 Simulación tipo "${tipo}" iniciada.`);
});

// ==========================================
// ⏱️ 5️⃣ Simulación automática cada 2h
// ==========================================
setInterval(async () => {
  if (!selectedChip) return;

  const destino = Math.random() > 0.5 ? "casa" : "petshop";
  const location = lugares[destino];

  try {
    await axios.put(`${API_URL}/locations/${selectedChip}`, {
      ...location,
      source: "auto_simulation",
      movement_detected: destino === "petshop",
    });
    console.log(`Simulación automática enviada (${selectedChip}): ${location.address}`);
  } catch (err) {
    console.error("Error en simulación automática:", err.message);
  }
}, 2 * 60 * 60 * 1000);

// ==========================================
// 🐾 Simulación de fuga (emergencia)
// ==========================================
async function simulateEmergencyEscape() {
  if (!selectedChip) return;

  try {
    const { data: chip } = await axios.get(`${API_URL}/chips/${selectedChip}`);
    const { pet_id, dueno_id } = chip;

    const { data: userDetails } = await axios.get(`${API_URL}/users/${dueno_id}/details`);
    const home = userDetails?.ubicacion;
    if (!home) return console.warn("⚠️ Dueño sin ubicación definida.");

    const newPos = generateRandomOffset(home.lat, home.lng, 5000);

    // 🔹 Obter endereço textual via reverse geocoding
    const reverse = await geo.reverseGeocode(newPos.lat, newPos.lng);
    const addressString = reverse?.display_name || `Área desconocida (${newPos.lat}, ${newPos.lng})`;

    await axios.put(`${API_URL}/locations/${selectedChip}`, {
      lat: newPos.lat,
      lng: newPos.lng,
      address: addressString,
      source: "emergency_simulation",
      movement_detected: true,
    });

    await axios.post(`${API_URL}/alerts`, {
      chip_id: selectedChip,
      pet_id,
      dueno_id,
      type: "emergency_escape",
      message: `La mascota con el chip (${selectedChip}) ha escapado.`,
      location: newPos,
    });

    console.log(`🚨 Fuga simulada (${selectedChip}) en ${newPos.lat}, ${newPos.lng}`);
  } catch (error) {
    console.error("Error en la simulación de fuga:", error.message);
  }
}
setInterval(simulateEmergencyEscape, 10 * 60 * 1000);

// ==========================================
// 🚶‍♂️ Simulación de paseo
// ==========================================
async function simulateWalkingPet() {
  if (!selectedChip) return;

  try {
    const { data: chip } = await axios.get(`${API_URL}/chips/${selectedChip}`);
    const { dueno_id } = chip;

    const { data: userDetails } = await axios.get(`${API_URL}/users/${dueno_id}/details`);
    const home = userDetails?.ubicacion;
    if (!home) return console.warn("⚠️ Dueño sin ubicación definida.");

    const newPos = generateRandomOffset(home.lat, home.lng, 500);

    // 🔹 Obter endereço textual via reverse geocoding
    const reverse = await geo.reverseGeocode(newPos.lat, newPos.lng);
    const addressString = reverse?.display_name || `Paseo por la área (${newPos.lat}, ${newPos.lng})`;

    await axios.put(`${API_URL}/locations/${selectedChip}`, {
      lat: newPos.lat,
      lng: newPos.lng,
      address: addressString,
      source: "walking_simulation",
      movement_detected: true,
    });

    console.log(`🐾 Paseo simulado (${selectedChip}): ${newPos.lat},${newPos.lng}`);
  } catch (err) {
    console.error("Error en la simulación de paseo:", err.message);
  }
}
setInterval(simulateWalkingPet, 30 * 1000);

// ==========================================
// 🕐 Simulación del último movimiento
// ==========================================
async function simulateLastMovement() {
  if (!selectedChip) return;

  try {
    const { data: chip } = await axios.get(`${API_URL}/chips/${selectedChip}`);
    const { dueno_id } = chip;

    const { data: userDetails } = await axios.get(`${API_URL}/users/${dueno_id}/details`);
    const home = userDetails?.ubicacion;
    if (!home) return console.warn("⚠️ Dueño sin ubicación definida.");

    const distance = 600 + Math.random() * 400;
    const newPos = generateRandomOffset(home.lat, home.lng, distance);

    // 🔹 Obter endereço textual via reverse geocoding
    const reverse = await geo.reverseGeocode(newPos.lat, newPos.lng);
    const addressString = reverse?.display_name || `Área desconocida (${newPos.lat}, ${newPos.lng})`;

    await axios.put(`${API_URL}/locations/${selectedChip}`, {
      lat: newPos.lat,
      lng: newPos.lng,
      address: addressString,
      source: "last_movement_simulation",
      movement_detected: true,
    });

    console.log(`📍 Último movimiento simulado (${selectedChip}): ${newPos.lat},${newPos.lng}`);
  } catch (err) {
    console.error("Error en la simulación del último movimiento:", err.message);
  }
}
