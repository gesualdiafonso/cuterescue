// Refactoramento de las instancias que son realmente necesarias
import PetService from "./usePetService.js";
import LocationService from "./useLocationService.js";
import DetailsUser from "./useDetailsUser.js";
import ChipService from "./useChipService.js";

// Creando las instancias
const petService = new PetService();
const locationService = new LocationService();
const detailsUserService = new DetailsUser();
const chipService = new ChipService();

// hago la ligación circular
petService.setLocationService(locationService);
petService.setDetailsUserService(detailsUserService);

locationService.setPetService(petService);
locationService.setDetailsUserService(detailsUserService);
locationService.setChipService(chipService);

chipService.setDetailsUserService(detailsUserService);
chipService.setLocationService(locationService);


export {
    petService,
    locationService,
    detailsUserService
}