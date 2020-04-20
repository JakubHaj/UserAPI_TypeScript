import { Request, Response } from 'express';
import User, { IUser, IUserModel } from '../models/UserModel'
import { IReqWithUser, IToken } from '../interfaces/interaces';

class UserController {
    public async createUser(req: Request, res: Response): Promise<void> {
        try {
            const newUser: IUser = new User(req.body);
            await newUser.generateAuthToken();
            await newUser.save();
            res.send('new user created')
        } catch (error) {
            res.status(400).send(error);
        } 
    }

    public async authUser(req: Request, res: Response): Promise<void> {
        try {
            const user = await User.findByCredentials(req.body.email, req.body.password);
            const token = await user.generateAuthToken();

            res.send({  user: user.getPublicProfile(), token  });
        } catch (er) {
            res.status(400).send(er);
        }
    }

    public async logout(req: IReqWithUser, res: Response): Promise<void>  {
        try {
            req.user!.tokens = req.user!.tokens.filter((token) => {
                return (token.token !== req.token)
            });
            await req.user?.save();

            res.send()
        } catch (er) {
            res.status(500).send(er);
        }
    }

    public async getUsers(req: IReqWithUser, res: Response) {
        try {
            const users = await User.find({});
            res.send(users);
        } catch (er) {
            res.status(404).send(er);
        }
    };

    public async getMe(req: IReqWithUser, res: Response) {
        try {
            res.send(req.user);
        } catch (er) {
            res.status(404).send(er);
        }
    };
}

export default UserController;