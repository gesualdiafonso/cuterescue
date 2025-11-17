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

        // --- Somente processa "ubicacion" se veio no body ---
        if (updateFields.ubicacion !== undefined) {
            let ubicacion = updateFields.ubicacion;

            if (typeof ubicacion === "string" && ubicacion.trim() !== "") {
                const address = ubicacion.trim();
                const geocodeData = await geo.getCoordinatesFromAddress(address);

                if (!geocodeData) {
                    throw new Error("Enderezo inválido");
                }

                updateFields.ubicacion = {
                    address,
                    lat: geocodeData.lat,
                    lng: geocodeData.lng,
                    source: "geocoding_osm",
                    is_safe_location: true
                };
            } 
            else if (typeof ubicacion === "object" && ubicacion.address) {
                const geocodeData = await geo.getCoordinatesFromAddress(ubicacion.address);

                if (!geocodeData) {
                    throw new Error("Enderezo inválido");
                }

                updateFields.ubicacion = {
                    ...ubicacion,
                    lat: geocodeData.lat,
                    lng: geocodeData.lng,
                    source: "geocoding_osm",
                    is_safe_location: true
                };
            } 
            else {
                throw new Error("El campo 'ubicacion' debe ser una cadena o un objeto con 'address'");
            }
        }

    return await this.detailsUserModel.update(userId, updateFields);
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