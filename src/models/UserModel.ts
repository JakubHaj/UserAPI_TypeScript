import mongoose, { Schema, Model, Document, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { IToken, IResUser } from '../interfaces/interaces';
import { json } from 'express';

export interface IUserDocument extends Document {
    email: string;
    name: string;
    password: string;
    tokens: Array<IToken>;
}

export interface IUserModel extends Model<IUser> {
    findByCredentials(name: string, password: string): Promise<IUser>;
}

export interface IUser extends IUserDocument {
    generateAuthToken(): string;
    getPublicProfile(): IResUser;
}

const userSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v: string) {
                if (!validator.isEmail(v)) {
                    throw new Error('wrong email');
                }
                return true;
            }
        }
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});
userSchema.method('getPublicProfile', function(this: IUser) {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password
    delete userObject.tokens

    return userObject;
    }
);

userSchema.method('generateAuthToken', async function (this: IUser) {
    const user= this;
    const token = jwt.sign({    _id: user._id.toString() }, 'secretKey');

    user.tokens = user.tokens.concat({  token: token });
    await user.save();
    return token;
});

userSchema.statics.findByCredentials = async (email: string, password: string) => {
    const user = <IUser>await User.findOne({ email: email });
    if (!user) {
        console.log('wrong email')
        throw new Error('No user with given email');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Wrong password!');
    }
    return user;    
};

userSchema.pre('save', async function(next) {
    const user: IUser = <IUser>this;
    if (this.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
});

const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;