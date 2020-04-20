import { Router } from 'express';
import UserController from '../../controllers/userController';
import auth from '../../middleware/auth';

class UserRoute {
    public router: Router;
    public userController: UserController = new UserController();
    
    constructor() {
        this.router = Router();
        this.routes();
    }

    private routes() {
        this.router.post('/', this.userController.createUser);

        this.router.post('/auth', this.userController.authUser);

        this.router.post('/logout', auth, this.userController.logout);

        this.router.get('/', this.userController.getUsers);

        this.router.get('/me', auth, this.userController.getMe);

    }

}

export default UserRoute;