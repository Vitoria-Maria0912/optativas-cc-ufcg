import { Login, PrismaClient } from "@prisma/client";
import { User } from "../model/User";

export interface UserRepositoryInterface {
    createUser(user: User): Promise<User>;
    registerUser(userId: number, login: Login): Promise<User>;
}

export class UserRepository implements UserRepositoryInterface {

    private prisma: PrismaClient = new PrismaClient();

    async createUser(user: User): Promise<User> {
        return await this.prisma.user.create({
            data: {
                id : user.id,
                role : user.role,
                name : user.name,
            }
        });
    }

    async registerUser(userId: number, login: Login): Promise<User> {
        return await this.prisma.user.update({ 
            where: { id: userId },
            data: {
                login : { 
                    create: {
                        id : login.id,
                        email : login.email,
                        password : login.password,
                    }
                }
            }
        });
    }
}