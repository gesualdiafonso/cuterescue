const DetailsUserType = {
    userId : "string",
    nombre: "string",
    fecha_nacimiento: "string",
    genero: "string",
    tipo_documento: "string",
    documento: "string",
    telefono: "string",
    ubicacion: {
        address: "string",
        lat: "number",
        lng: "number",
        source: "string",
        is_safe_location: "boolean"
    },
    image: "string",
    pets: []
};

// Validacion de los campos detalles
export function validateDetailsUser(
    data,
    requiredFields = ["userId", "nombre", "telefono"]
) {
    const errors = [];

    for (const field of requiredFields) {
        if (!(field in data)) {
            errors.push(`El campo "${field}" es obligatorio`);
        } else {
            const expectedType = DetailsUserType[field];
            if (expectedType && typeof data[field] !== expectedType) {
                errors.push(
                    `El campo "${field}" debe ser de tipo ${expectedType}, recibido: ${typeof data[field]}`
                );
            }
        }
    }

    // pets no es obligatorio, pero si viene debe ser array
    if ("pets" in data && !Array.isArray(data.pets)) {
        errors.push(`El campo "pets" debe ser un array si se proporciona`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export default { DetailsUserType };