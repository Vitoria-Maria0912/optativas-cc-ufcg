import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../express/server';
import { UserService } from './UserService';
import { User } from "../model/User";
import { validateLoginCredentials } from '../util/util';

export interface AuthServiceInterface {
    createLogin(emailLogin: string, passwordLogin: string): Promise<string>;
    generateToken(user: User): string;
    comparePassword(password: string, hashPassword: string): Promise<boolean>;
    hashedPassword(password: string): Promise<string>;
}

export class AuthService implements AuthServiceInterface {

    private userService = new UserService();

    async createLogin(emailLogin: string, passwordLogin: string): Promise<string> {
        try{
            const user = await this.userService.getUserByEmail(emailLogin);
            const passwordHash = await this.hashedPassword(passwordLogin);

            if (await validateLoginCredentials(user, emailLogin, passwordLogin, passwordHash)) {
                await this.userService.registerUser(user.id, emailLogin, passwordHash);
            }

            return this.generateToken(user);
            
        } catch (error) { throw error; }
    }
    
    generateToken(user: User): string {
        return jwt.sign(user, JWT_SECRET)
    }
    
    async comparePassword(password: string, hashPassword: string): Promise<boolean> {
        return await bcrypt.compare(password, hashPassword);
    }

    async hashedPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }
}
