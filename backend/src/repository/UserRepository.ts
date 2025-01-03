import { PrismaClient, Role } from "@prisma/client";
import { User } from "../model/User";
import { Login } from "../model/Login";

export interface UserRepositoryInterface {
    createUser(user: User): Promise<User>;
    registerUser(userId: number, email: string, password: string): Promise<User>;
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
}

export class UserRepository implements UserRepositoryInterface {
    
    private prisma: PrismaClient = new PrismaClient();

    async createUser(user: User): Promise<User> {
        return await this.prisma.user.create({
            data: {
                id : user.id,
                role : user.role,
                name : user.name,
                email : user.email,
            }
        });
    }

    async registerUser(userId: number, email: string, password: string): Promise<User> {
        const { id } = await this.prisma.login.create({
            data: { password : password, email : email, }
        });

        return await this.prisma.user.update({ 
            where: { id: userId },
            data: {
                login : { 
                    connect: {
                        id: id,
                    }
                }
            }
        });
    }

    async getUserById(userId: number): Promise<User> {
        return await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
    }

    async getUserByEmail(userEmail: string): Promise<User> {
        return await this.prisma.user.findUniqueOrThrow({ where: { email: userEmail } });
    }

    async getUserByRole(userRole: Role): Promise<User[]> {
        return await this.prisma.user.findMany({ where: { role: userRole } });
    }
}