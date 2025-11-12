import DetailsUser from "../model/DetailsUser.js";
import UserService from "./UserService.js";
import GeoAPI from "../lib/utils/services/GeoAPI.js";

const geo = new GeoAPI();

const detailsUserModel = new DetailsUser;
const userService = new UserService;

class DetailsUserService
{
    constructor(){
        this.detailsUserModel = detailsUserModel;
        this.userService = userService;
    }

    async getAll(){
        return await this.detailsUserModel.getAll();
    }

    async getByUserId(userId){
        return await this.detailsUserModel.getByUserId(userId);
    }

    async create(userId, fields){
        const user = await this.userService.getUserById(userId);
        if(!user){
            throw new Error('Usuario no existe');
        }

        const existingDetails = await this.detailsUserModel.getByUserId(userId);
        if(existingDetails){
            throw new Error('Los detalles del usuario ya existen');
        }

        //inserto la ubicación 
        let ubicacion = fields.ubicacion;
        if (ubicacion){
            // Caso la ubicacion viene como string --> convertir en objeto
            if(typeof ubicacion === "string"){
                const address = ubicacion.trim();

                const geocodeData = await geo.getCoordinatesFromAddress(address);

                if(geocodeData){
                    ubicacion = {
                        address,
                        lat: geocodeData.lat,
                        lng: geocodeData.lng,
                        souce: 'geocoding_osm',
                        is_safe_location: true
                    };
                } else{
                    throw new Error(
                        "No se pudo geocodificar el enderezo proporcionado. Por favor, verifique y corrija el enderezo."
                    );
                }
            }
        } 

        // Caso la ubicación ya viene como objeto con address ingresado --> completar con coordenadas
        else if (typeof ubicacion === "object" && ubicacion.address){
            const geocodeData = await geo.getCoordinatesFromAddress(ubicacion.address);

            if(geocodeData){
                ubicacion = {
                    ...ubicacion,
                    lat: geocodeData.lat,
                    lng: geocodeData.lng,
                    source: 'geocoding_osm',
                    is_safe_location: true
                };
            } else{
                throw new Error(
                    "No se pudo geocodificar el enderezo proporcionado. Por favor, verifique y corrija el enderezo."
                );
            }
        }

        // Caso la ubicación no sea String o Objeto valido
        else{
            throw new Error(
                "El campo 'ubicacion' debe ser una cadena de texto (enderezo) o un objeto con el campo 'address'."
            );
        }

        const details = await this.detailsUserModel.create(userId, { ...fields, ubicacion });
        return details;
    }

    async update(userId, updateFields) {
    const user = await this.userService.getUserById(userId);
    if (!user) throw new Error("Usuario no existe");

    const existingDetails = await this.detailsUserModel.getByUserId(userId);
    if (!existingDetails) throw new Error("Los detalles del usuario no existen");

    // --- Lógica especial para 'ubicacion' ---
    let ubicacion = updateFields.ubicacion;

    if (ubicacion !== undefined) {
        // 🔹 Caso venha como string (novo endereço digitado)
        if (typeof ubicacion === "string" && ubicacion.trim() !== "") {
        const address = ubicacion.trim();
        const geocodeData = await geo.getCoordinatesFromAddress(address);

        if (geocodeData) {
            ubicacion = {
            address,
            lat: geocodeData.lat,
            lng: geocodeData.lng,
            source: "geocoding_osm",
            is_safe_location: true,
            };
        } else {
            throw new Error("No se pudo geocodificar el enderezo proporcionado.");
        }
        }

        // 🔹 Caso venha como objeto com address novo
        else if (typeof ubicacion === "object" && ubicacion.address) {
        const geocodeData = await geo.getCoordinatesFromAddress(ubicacion.address);
        if (geocodeData) {
            ubicacion = {
            ...ubicacion,
            lat: geocodeData.lat,
            lng: geocodeData.lng,
            source: "geocoding_osm",
            is_safe_location: true,
            };
        } else {
            throw new Error("No se pudo geocodificar el enderezo proporcionado.");
        }
        }

        // 🔹 Caso venha vazio ou sem alteração → mantém a atual
        else if (!ubicacion || ubicacion === "" || ubicacion === null) {
        ubicacion = existingDetails.ubicacion;
        }

        // 🔹 Caso o formato não seja válido
        else if (typeof ubicacion !== "object") {
        throw new Error(
            "El campo 'ubicacion' debe ser una cadena de texto o un objeto válido con 'address'."
        );
        }

        updateFields.ubicacion = ubicacion;
    } else {
        // 🔹 Caso não envie 'ubicacion' → mantém a atual
        updateFields.ubicacion = existingDetails.ubicacion;
    }



    const updatedDetails = await this.detailsUserModel.update(userId, updateFields);
    return updatedDetails;
    }


    async delete(userId){
        const user = await this.userService.getUserById(userId);
        if(!user){
            throw new Error('Usuario no existe');
        }

        const existingDetails = await this.detailsUserModel.getByUserId(userId);
        if(!existingDetails){
            throw new Error('Los detalles del usuario no existen');
        }

        return await this.detailsUserModel.delete(userId);
    }

}

export default DetailsUserService;