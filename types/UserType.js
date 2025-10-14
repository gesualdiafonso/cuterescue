const UserType = {
    email: "string",
    password: "string",
    active: "string"
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

export default { UserType };