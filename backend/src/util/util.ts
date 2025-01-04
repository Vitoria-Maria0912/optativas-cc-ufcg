import jwt from 'jsonwebtoken';
import { Role } from "@prisma/client";
import { JWT_SECRET } from "../express/server";
import { UserService } from './../service/UserService';
import { User, UserInterface } from '../model/User';
import { InvalidCredentialsError, UserNotAuthorizedError } from "../errorHandler/ErrorHandler";

// I need to check this better, something it's wrong, I think 
export const isAdministrator = (authHeader: any): boolean => {

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserInterface;

        if (decoded.role === Role.ADMINISTRATOR) { return true; }
        else { throw new UserNotAuthorizedError(`Access denied: Administrators only!`) }

    } catch (error) {
        throw new UserNotAuthorizedError(`Access denied: invalid token!`)
    }    
}

export const validateCredentials = async (user: User) => {

    if (!user.name) { throw new InvalidCredentialsError('Name is required!'); }

    const notOnlyNumbers = new RegExp('^(?!\\d+$).+');

    if (!notOnlyNumbers.test(user.name)) { throw new InvalidCredentialsError('Name cannot contains only numbers!'); }

    if (!user.email) { throw new InvalidCredentialsError('Email is required!'); }

    if (!user.email.includes('@')) { throw new InvalidCredentialsError(`This email ${ user.email } is invalid, should be like 'name@example.com'!`); }

    const userService = new UserService();

    try { 
        const existingUser = await userService.getUserByEmail(user.email); 
        if (existingUser) { throw new InvalidCredentialsError(`Email ${ user.email } is already in use!`); }
    } catch (error) {
        if (error instanceof InvalidCredentialsError) { throw new InvalidCredentialsError(error.message); }
    }
    
    if (user.role !== Role.ADMINISTRATOR && user.role !== Role.COMMON) { throw new InvalidCredentialsError('The role must be either ADMINISTRATOR or COMMON!'); }
}