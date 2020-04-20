import { Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/UserModel';
import { IToken, IReqWithUser } from '../interfaces/interaces';

const auth = async (req: IReqWithUser, res: Response, next: Function) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '')!;
        const decoded = <IToken>jwt.verify(token, 'secretKey');
        const user = await User.findOne({   _id: decoded._id, 'tokens.token': token});
        if (!user) {
            throw new Error();
        };
        req.token = token;
        req.user = user;
        next();
    } catch (er) {
        res.status(401).send({ error: 'Please authenticate!'})
    }
}

export default auth;