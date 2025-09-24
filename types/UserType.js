const UserType = {
    email: "string",
    password: "string",
    active: "string"
};

const DetailsUserType = {
    userId : "string",
    nombre: "string",
    telefono: "string",
    ubicacion: "string",
    pets: []
};

// Validación de los campos de Usuarios
export function validateUser(data, requiredFields = ["email", "password"]){
    const errors = [];

    for (const field of requiredFields){
        if(!(field in data)){
            errors.push(`El campo "${field}, son obligatorios`);
        } else if(typeof data[field] !== UserType[field]){
            errors.push(
                `El campo "${field}" debe ser de tipo ${UserType[field]}, recebido: ${typeof data[field]}`
            );
        }

    }

    return{
        isValid: errors.length === 0,
        errors
    }
}

// Validacion de los campos detalles
export function validateDetailsUser(
    data,
    requiredFields = ["userId", "nombre", "telefono", "ubicacion"]
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