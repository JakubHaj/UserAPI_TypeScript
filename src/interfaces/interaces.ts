import { Request } from 'express';
import { IUser } from "../models/UserModel";

export interface IToken {
        _id?: string,
        token: string
}

export interface IReqWithUser extends Request {
    user? : IUser,
    token?: string; 
}

export interface IResUser {
    _id: string,
    email: string,
    name: string
}