const PetType = {
    nombre: "string",
    id_dueno: "string",
    especie: "string",
    raza: "string",
    fecha_nacimiento: "string",
    edad: "number",
    sexo: "string",
    color: "string",
    foto_url: "string",
    estado_salud: "string",
    activo: "boolean",
    home_location: "string", // Dirección del hogar del dueño, heredada de DetailsUser
    last_location: "string", // Última ubicación conocida, heredada de Locations
};

// Validación de los campos de Mascotas
export function validatePet(data, requiredFields = ["nombre", "id_dueno", "especie", "raza", "fecha_nacimiento", "edad", "sexo", "color", "estado_salud"]) {
    const errors = [];

    for (const field of requiredFields) {
        if (!(field in data)) {
            errors.push(`El campo "${field}" es obligatorio`);
        } else if (typeof data[field] !== PetType[field]) {
            errors.push(
                `El campo "${field}" debe ser de tipo ${PetType[field]}, recibido: ${typeof data[field]}`
            );
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export default { PetType };