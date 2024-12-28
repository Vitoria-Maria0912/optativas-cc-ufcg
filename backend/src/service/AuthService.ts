import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from "../model/User";
import { JWT_SECRET } from '../express/server';

export class AuthService {

    generateToken(user: User): string {
        return jwt.sign({ id: user.id, email: user.login?.email }, JWT_SECRET)
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }
}