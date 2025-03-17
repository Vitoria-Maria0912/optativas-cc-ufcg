import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../express/server';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './../repository/UserRepository';
import { UserService } from './UserService';
import { User } from "../model/User";
import { comparePassword, validateLoginCredentials } from '../util/util';
import { AuthenticationError, InvalidCredentialsError } from '../errorHandler/ErrorHandler';

export interface AuthServiceInterface {
    createLogin(emailLogin: string, passwordLogin: string): Promise<string>;
    registerUser(userId: number, emailLogin: string, passwordLogin: string): Promise<User>;
    getTokenByUserEmail(user: User, password: string): Promise<{ email: string; token: string }>
    generateToken(user: User): string;
    hashedPassword(password: string): Promise<string>;
}

export class AuthService implements AuthServiceInterface {

    private userRepository = new UserRepository();

    private userService = new UserService();

    private prismaClient = new PrismaClient();

    async createLogin(emailLogin: string, passwordLogin: string): Promise<string> {
        try {
            const user = await this.userService.getUserByEmail(emailLogin);
            const passwordHash = await this.hashedPassword(passwordLogin);
            const token = this.generateToken(user);

            if (await validateLoginCredentials(user, emailLogin, passwordLogin)) {
                await this.registerUser(user.id, emailLogin, passwordHash);
            }

            return token;

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

    async getTokenByUserEmail(user: User, password: string): Promise<{ email: string; token: string }> {

        if (!password) { throw new InvalidCredentialsError('Password is required!'); }
        
        try { 
            const login = await this.userRepository.getTokenByUserEmail(user.email); 
            if (!(await comparePassword(password, login.password))) { throw new InvalidCredentialsError('Password is incorrect!'); }   
            const token = this.generateToken(user);
            
            return { email: login.email, token };
        }
        catch (error : any) { 
            if (error instanceof InvalidCredentialsError) { throw new InvalidCredentialsError(error.message); }
            else if (error.code === "P2025") { throw new AuthenticationError(`This user '${ user.email }' doesn't have a login!`); }
            else { throw new Error(`Error trying to get this user '${ user.email }' login!`); }
        }
    }
    
    public generateToken(user: User): string { return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' }); }
    
    async hashedPassword(password: string): Promise<string> { return await bcrypt.hash(password, 10); }
}
