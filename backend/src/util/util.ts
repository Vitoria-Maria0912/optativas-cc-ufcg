import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Role } from "@prisma/client";
import { JWT_SECRET } from "../express/server";
import { UserService } from './../service/UserService';
import { User, UserInterface } from '../model/User';
import { InvalidCredentialsError, UserNotAuthorizedError } from "../errorHandler/ErrorHandler";

export const isAdministrator = (authHeader: any): boolean => {
    
    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new InvalidCredentialsError('Access denied, token is missing!');
        }
    
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as UserInterface;

        if (decoded.role === Role.ADMINISTRATOR) { return true; }
        else { throw new UserNotAuthorizedError(`Access denied: Administrators only!`) }

    } catch (error: any) {
        if (error instanceof UserNotAuthorizedError) { throw new UserNotAuthorizedError(error.message); }
        else if (error instanceof InvalidCredentialsError) { throw new InvalidCredentialsError(error.message); }
        else if (error instanceof jwt.TokenExpiredError) { throw new InvalidCredentialsError('Access denied, token has expired!') }
        else { throw new UserNotAuthorizedError(`Access denied: invalid token!`); }
    }    
}

export const validateAllCredentials = async (user: User) => {

    if (!user.name) { throw new InvalidCredentialsError('Name is required!'); }

    const notOnlyNumbers = new RegExp('^(?!\\d+$).+');

    if (!notOnlyNumbers.test(user.name)) { throw new InvalidCredentialsError('Name cannot contains only numbers!'); }

    if (!user.email) { throw new InvalidCredentialsError('Email is required!'); }

    if (!user.email.includes('@')) { throw new InvalidCredentialsError(`This email '${ user.email }' is invalid, should be like 'name@example.com'!`); }

    const userService = new UserService();

    try { 
        const existingUser = await userService.getUserByEmail(user.email); 
        if (existingUser) { throw new InvalidCredentialsError(`This email '${ user.email }' is already in use!`); }
    } catch (error) {
        if (error instanceof InvalidCredentialsError) { throw new InvalidCredentialsError(error.message); }
    }

    if (user.role && user.role !== Role.ADMINISTRATOR && user.role !== Role.COMMON) { throw new InvalidCredentialsError('The role must be either ADMINISTRATOR or COMMON!'); }
}

export const validateLoginCredentials = async (user: User, email: string, password: string, passwordHash: string) : Promise<boolean> => {

    if (!email) { throw new InvalidCredentialsError('Email is required!'); }
    
    if (email !== user.email) { throw new InvalidCredentialsError(`This email '${ email }' is invalid!`); }

    if (!password) { throw new InvalidCredentialsError('Password is required!'); }

    const isValidPassword = await bcrypt.compare(password, passwordHash);

    if (!isValidPassword) { throw new InvalidCredentialsError(`This password '${ password }' is invalid!`); }

    return true;
}