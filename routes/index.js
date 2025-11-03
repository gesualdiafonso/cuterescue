import taskLocation from './taskLocationRouter.js';
import taskPets from './taskPetsRouter.js';
import taskUser from './taskUserRouter.js';
import taskUserDetails from './taskDetailsUserRouter.js';
import taskChips from './taskChipsRouter.js';
import authRouter from './authRouter.js';

function routerAPI(app) {
    app.use(authRouter);
    app.use(taskPets);
    app.use(taskLocation);
    app.use(taskUser);
    app.use(taskUserDetails);
    app.use(taskChips);
}

export default routerAPI;