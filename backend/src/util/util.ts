import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Role } from "@prisma/client";
import { JWT_SECRET } from "../express/server";
import { UserService } from './../service/UserService';
import { User, UserInterface } from '../model/User';
import { AuthenticationError, InvalidCredentialsError, UserNotAuthorizedError } from "../errorHandler/ErrorHandler";

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
}

export const isAdministrator = (authHeader: any): boolean => {
    
    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('Access denied, token is missing!');
        }
    
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as UserInterface;

        if (decoded.role === Role.ADMINISTRATOR) { return true; }
        else { throw new UserNotAuthorizedError(`Access denied: Administrators only!`) }

    } catch (error: any) {
        if (error instanceof UserNotAuthorizedError || error instanceof InvalidCredentialsError) { throw error; }
        else if (error instanceof jwt.TokenExpiredError) { throw new InvalidCredentialsError('Access denied, token has expired!') }
        else { throw new UserNotAuthorizedError(`Access denied: invalid token!`); }
    }    
}

export const validateAllCredentials = async (user: User) => {

    const userService = new UserService();

    try { if (await userService.getUserByEmail(user.email)) { throw new InvalidCredentialsError(`This email '${ user.email }' is already in use!`); }
    } catch (error) { if (error instanceof InvalidCredentialsError) { throw new InvalidCredentialsError(error.message); } }

    if (!user.name) { throw new InvalidCredentialsError('Name is required!'); }

    const notOnlyNumbers = new RegExp('^(?!\\d+$).+');

    if (!notOnlyNumbers.test(user.name)) { throw new InvalidCredentialsError('Name cannot contain only numbers!'); }

    if (user.name.length < 3) { throw new InvalidCredentialsError('Name is too short, should be at least 3 characters!'); }

    if (user.name.length > 50) { throw new InvalidCredentialsError('Name is too long, should be at most 50 characters!'); }

    if (!notOnlyNumbers.test(user.email)) { throw new InvalidCredentialsError('Email cannot contains only numbers!'); }

    if (!user.email) { throw new InvalidCredentialsError('Email is required!'); }

    if (!user.email.includes('@')) { throw new InvalidCredentialsError(`This email '${ user.email }' is invalid, should be like 'name@example.com'!`); }

    if (user.email.length < 15) { throw new InvalidCredentialsError('Email is too short, should be at least 15 characters!'); }

    if (user.email.length > 50) { throw new InvalidCredentialsError('Email is too long, should be at most 50 characters!'); }

    if (user.role && user.role !== Role.ADMINISTRATOR && user.role !== Role.COMMON) { throw new InvalidCredentialsError('The role must be either ADMINISTRATOR or COMMON!'); }
}

export const validateLoginCredentials = async (user: User, email: string, password: string, passwordHash: string) : Promise<boolean> => {

    if (!email) { throw new InvalidCredentialsError('Email is required!'); }
    
    if (email !== user.email) { throw new InvalidCredentialsError(`This email '${ email }' is invalid!`); }

    if (!password) { throw new InvalidCredentialsError('Password is required!'); }

    const passwordNumbersAndLetters = new RegExp('^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$')

    if (passwordNumbersAndLetters.test(password)) { throw new InvalidCredentialsError(`This password '${ password }' is invalid, should contains letters and numbers!`); }

    if (password.length < 8) { throw new InvalidCredentialsError('Password is too short, should be at least 8 characters!'); }

    if (password.length > 20) { throw new InvalidCredentialsError('Password is too long, should be at most 20 characters!'); }    

    return true;
}
