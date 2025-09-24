const PetType = {
    chip_id: "string",
    nombre: "string",
    especie: "string",
    raza: "string",
    dueno_id: "string",
    fecha_nacimiento: "string",
    edad: "number",
    sexo: "string",
    color: "string",
    foto_url: "string",
    activo: "boolean",
    ultima_localizacion: {
        lat: "number",
        lng: "number",
        timestamp: "Date"
    },
    estado_salud: "string",
    alertas: "array",
    collar_bateria: "number",
    nivel_actividad: "string"
};

export default PetType;