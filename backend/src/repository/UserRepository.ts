import { PrismaClient, Role } from "@prisma/client";
import { User } from "../model/User";
import { Login } from "../model/Login";

export interface UserRepositoryInterface {
    createUser(user: User): Promise<User>;
    registerUser(userId: number, email: string, password: string): Promise<User>;
    getAllUsers(offset: number, limit: number) : Promise<{users: User[], total: number}>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
    getTokenByUserEmail(userEmail: string): Promise<Login>;
    patchUser(idUser: number, updates: Partial<Omit<User, 'id'>>): Promise<void>;
    deleteOneUser(userId: number): Promise<void>;
    deleteAllUsers() : Promise<void>;
    getAmountOfUsers(): Promise<number>;
}

export class UserRepository implements UserRepositoryInterface {
    
    private prisma: PrismaClient = new PrismaClient();
    
    async getAmountOfUsers(): Promise<number> {
        return await this.prisma.user.count();
    }

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

    async getAllUsers(offset: number, limit: number): Promise<{users: User[], total: number}> { 
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip: offset,
                take: limit,
                select: { id: true, role: true, name: true, email: true }
            }),
            this.prisma.discipline.count()
        ]);
        return {users, total}
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