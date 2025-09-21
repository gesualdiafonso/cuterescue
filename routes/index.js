import taskLocation from './taskLocationRouter.js';
import taskPets from './taskPetsRouter.js';
import taskUser from './taskUserRouter.js';
import taskUserDetails from './taskDetailsUserRouter.js';

function routerAPI(app) {
    app.use(taskPets);
    app.use(taskLocation);
    app.use(taskUser);
    app.use(taskUserDetails)
}

export default routerAPI;