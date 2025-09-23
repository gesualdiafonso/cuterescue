// Refactoramento de las instancias que son realmente necesarias
import PetService from "./usePetService.js";
import LocationService from "./useLocationService.js";

// Creando las instancias
const petService = new PetService();
const locationService = new LocationService();

// hago la ligación circular
petService.setLocationService(locationService);
locationService.setPetService(petService);

export {
    petService,
    locationService
}