import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../express/server';
import { UserService } from './UserService';
import { User } from "../model/User";
import { InvalidCredentialsError } from '../errorHandler/ErrorHandler';

export interface AuthServiceInterface {
    createLogin(email: string, password: string): Promise<string>;
    generateToken(user: User): string;
    comparePassword(password: string, hashPassword: string): Promise<boolean>;
    hashedPassword(password: string): Promise<string>;
    validateCredentials(user: User, email: string, password: string, passwordHash: string) : Promise<boolean>;
}

export class AuthService implements AuthServiceInterface {

    async createLogin(email: string, password: string): Promise<string> {
        try{
            const user = await (new UserService).getUserByEmail(email);
            const passwordHash = await this.hashedPassword(password);

            if (await this.validateCredentials(user, email, password, passwordHash)){
                await (new UserService).registerUser(user.id, email, passwordHash);
            }

            return this.generateToken(user);
            
        } catch (error) { throw error; }
    }
    
    generateToken(user: User): string {
        return jwt.sign({ id: user.id, email: user.login?.email }, JWT_SECRET)
    }
    
    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    }

    async hashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
    
    async validateCredentials(user: User, email: string, password: string, passwordHash: string) : Promise<boolean> {

        if (!email) { throw new InvalidCredentialsError('Email is required!'); }
        
        if (email !== user.login?.email) { throw new InvalidCredentialsError(`This email (${ email }) is invalid!`); }

        if (!password) { throw new InvalidCredentialsError('Password is required!'); }

        const isValidPassword = await bcrypt.compare(password, passwordHash);
    
        if (!isValidPassword) { throw new InvalidCredentialsError(`This password (${ password }) is invalid!`); }

        return true;
    }
}
