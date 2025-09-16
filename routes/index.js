import taskLocation from './taskLocationRouter.js';
import taskPets from './taskPetsRouter.js';
import taskUser from './taskUserRouter.js';

function routerAPI(app) {
    app.use(taskPets);
    app.use(taskLocation);
    app.use(taskUser);
}

export default routerAPI;