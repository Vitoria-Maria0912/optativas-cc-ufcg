import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../express/server";
import { Role } from "@prisma/client";
import { UserNotAuthorizedError } from "../errorHandler/ErrorHandler";
import { UserInterface } from '../model/User';

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