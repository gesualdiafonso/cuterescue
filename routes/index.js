import taskLocation from './taskLocationRouter.js';
import taskPets from './taskPetsRouter.js';
import taskUser from './taskUserRouter.js';
import taskUserDetails from './taskDetailsUserRouter.js';
import taskChips from './taskChipsRouter.js';
import authRouter from './authRouter.js';
import uploadRouter from './taskUploadRoute.js';


function routerAPI(app) {
    app.use(authRouter);
    app.use(uploadRouter);
    app.use(taskPets);
    app.use(taskLocation);
    app.use(taskUser);
    app.use(taskUserDetails);
    app.use(taskChips);
}

export default routerAPI;