import { PrismaClient, Role } from "@prisma/client";
import { User } from "../model/User";
import { Login } from "../model/Login";

export interface UserRepositoryInterface {
    createUser(user: User): Promise<User>;
    registerUser(userId: number, email: string, password: string): Promise<User>;
    getAllUsers() : Promise<User[]>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
    getTokenByUserEmail(userEmail: string): Promise<Login>;
    patchUser(idUser: number, updates: Partial<Omit<User, 'id'>>): Promise<void>;
    deleteOneUser(userId: number): Promise<void>;
    deleteAllUsers() : Promise<void>;
}

export class UserRepository implements UserRepositoryInterface {
    
    private prisma: PrismaClient = new PrismaClient();
    
    async createUser(user: User): Promise<User> {
        return await this.prisma.user.create({
            data: {
                id : user.id,
                role : user.role ?? Role.COMMON,
                name : user.name,
                email : user.email,
            }
        });
    }
    
    async registerUser(userId: number, email: string, password: string): Promise<User> {
        await this.prisma.login.create({data: { password : password, email : email, }});
        return await this.getUserById(userId);
    }
    
    async getUserById(userId: number): Promise<User> {
        return await this.prisma.user.findUniqueOrThrow({ 
            where: { id: userId },
            select: { id: true, role: true, name: true, email: true } 
        });
    }
    
    async getUserByEmail(userEmail: string): Promise<User> {
        return await this.prisma.user.findFirstOrThrow({ 
            where: { email: { equals: userEmail, mode: 'insensitive'} },
            select: { id: true, role: true, name: true, email: true } 
        });
    }
    
    async getUserByRole(userRole: Role): Promise<User[]> {
        return await this.prisma.user.findMany({ 
            where: { role: userRole }, 
            select: { id: true, role: true, name: true, email: true } 
        });
    }
    
    async getTokenByUserEmail(userEmail: string): Promise<Login> {
        return await this.prisma.login.findFirstOrThrow({ where: { email: { equals: userEmail, mode: 'insensitive'} } });
    }

    async getAllUsers(): Promise<User[]> { 
        return await this.prisma.user.findMany(
            { select: { id: true, role: true, name: true, email: true } }
        ); 
    }

    async patchUser(idUser: number, updates: Partial<Omit<User, 'id'>>): Promise<void> {
        const { plannings, ...userUpdates } = updates;
        await this.prisma.user.update({ where: { id: idUser }, data: userUpdates });
    }

    async deleteOneUser(idUser: number): Promise<void> {
        await this.prisma.user.delete({ where: { id: idUser } });
    }

    async deleteAllUsers(): Promise<void> { await this.prisma.user.deleteMany(); }
}