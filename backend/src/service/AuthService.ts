import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../express/server';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './../repository/UserRepository';
import { UserService } from './UserService';
import { User } from "../model/User";
import { validateLoginCredentials } from '../util/util';
import { AuthenticationError } from '../errorHandler/ErrorHandler';

export interface AuthServiceInterface {
    createLogin(emailLogin: string, passwordLogin: string): Promise<string>;
    registerUser(userId: number, emailLogin: string, passwordLogin: string): Promise<User>;
    generateToken(user: User): string;
    comparePassword(password: string, hashPassword: string): Promise<boolean>;
    hashedPassword(password: string): Promise<string>;
}

export class AuthService implements AuthServiceInterface {

    private userRepository = new UserRepository();

    private userService = new UserService();

    private prismaClient = new PrismaClient();

    async createLogin(emailLogin: string, passwordLogin: string): Promise<string> {
        try{
            const user = await this.userService.getUserByEmail(emailLogin);
            const passwordHash = await this.hashedPassword(passwordLogin);

            if (await validateLoginCredentials(user, emailLogin, passwordLogin, passwordHash)) {
                await this.registerUser(user.id, emailLogin, passwordHash);
            }

            return this.generateToken(user);
            
        } catch (error) { throw error; }
    }
    
    async registerUser(userId: number, emailLogin: string, passwordLogin: string): Promise<User> {
    try { 
        const login = await this.prismaClient.login.findUnique({ where: { email: emailLogin } });

        if (login) { throw new AuthenticationError(`A user with email '${ emailLogin }' is already registered!`); }
        else { return await this.userRepository.registerUser(userId, emailLogin, passwordLogin); }
    }
    catch (error : any) { 
        if (error instanceof AuthenticationError) { throw new AuthenticationError(error.message); }
        else { throw new Error(`Error trying to register this user!`); }
    }
}
    public generateToken(user: User): string { return jwt.sign(user, JWT_SECRET) }
    
    async hashedPassword(password: string): Promise<string> { return await bcrypt.hash(password, 10); }

    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    }
}
