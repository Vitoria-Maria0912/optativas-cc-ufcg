import { Role } from "@prisma/client";
import { User } from "../model/User";
import { UserDTO } from "../dtos/UserDTO";
import { UserRepository } from "../repository/UserRepository";
import { validateUserExistence, validateUserFields } from "../util/util";
import { InvalidCredentialsError, NotFoundError, UserAlreadyExistsError } from "../errorHandler/ErrorHandler";

export interface UserServiceInterface {
    createUser(user: UserDTO): Promise<User>;
    getAllUsers(offset: number, limit: number): Promise<{users: User[], total: number}>;
    getAmountOfUsers(): Promise<number>
    getUserById(userId: number): Promise<User>;
    getUserByEmail(userEmail: string): Promise<User>;
    getUserByRole(userRole: Role): Promise<User[]>;
    patchUser(userId: number, updates: Partial<Omit<User, 'id'>>): Promise<void>;
    deleteOneUser(userId: number): Promise<void>;
    deleteAllUsers() : Promise<void>;
}

export class UserService implements UserServiceInterface {
    
    private userRepository: UserRepository = new UserRepository();
    
    async createUser(user: UserDTO): Promise<User> {
        try { 
            const userToCreate = new User(user);
            await validateUserExistence(userToCreate);
            await validateUserFields(userToCreate);
            return await this.userRepository.createUser(userToCreate); }
        catch (error: any) { 
            if (error instanceof InvalidCredentialsError || error instanceof UserAlreadyExistsError) { throw error; }
            else { throw new Error("Error trying to create a user!"); }
        }
    }

    async getAllUsers(offset: number, limit: number): Promise<{users: User[], total: number}> { 
        const {users, total} = await this.userRepository.getAllUsers(offset, limit); 
        if (users.length === 0) { throw new NotFoundError('No users found!'); }
        return {users, total};
    }
        
    async getUserById(userId: number): Promise<User> {
        
        if (isNaN( userId )) { throw new InvalidCredentialsError("User ID must be a number!"); }

        try { return await this.userRepository.getUserById(userId); }
        catch (error : any) { 
            throw new NotFoundError(`User with ID '${ userId }' not found!`); }
    }
    
    async getUserByEmail(userEmail: string): Promise<User> {

        if (!userEmail) { throw new InvalidCredentialsError('Email is required!'); }

        else if (!userEmail.includes('@')) { throw new InvalidCredentialsError(`This email '${ userEmail }' is invalid, should be like 'name@example.com'!`); }
        
        try { return await this.userRepository.getUserByEmail(userEmail); } 
        catch (error: any) { throw new NotFoundError(`User with email '${ userEmail }' not found!`); }
    }
    
    async getUserByRole(userRole: Role): Promise<User[]> {

        const normalizedRole = userRole.toUpperCase() as Role;
                
        if (!Object.values(Role).includes(normalizedRole)) { throw new InvalidCredentialsError('The role must be either ADMINISTRATOR or COMMON!'); }
        
        try { const users = await this.userRepository.getUserByRole(normalizedRole);
            
            if (users.length === 0) { throw new NotFoundError(`No users with '${ normalizedRole }' role found!`); }
            
            else { return users; }
            
        } catch (error : any) {
            if (error instanceof InvalidCredentialsError || error instanceof NotFoundError) { throw error; }
            else { throw new Error("Error trying to get users by role!"); }
        }
    }

    async patchUser(userId: number, updates: Partial<Omit<User, 'id'>>): Promise<void> {

        if (isNaN( userId )) { throw new InvalidCredentialsError("User ID must be a number!"); }
        else if ((await this.getAmountOfUsers()) === 0) { throw new NotFoundError('No users found!'); }
        else if (updates.role !== undefined) { updates.role = updates.role.toLocaleUpperCase() as Role; }
        
        try {
            const user = await this.getUserById(userId);
            if (updates.role !== undefined && updates.role.trim() === "") { throw new InvalidCredentialsError('The role must be either ADMINISTRATOR or COMMON!'); }
            else if (updates.email && await this.getUserByEmail(updates.email)) { throw new UserAlreadyExistsError(`This email '${ updates.email }' is already in use!`); }
            else if (await validateUserFields({ ...user, ...updates })) { await this.userRepository.patchUser(userId, updates); }
        } catch (error) { throw error; }
    }

    async deleteOneUser(userId: number): Promise<void> {

        if ((await this.getAmountOfUsers()) === 0) { throw new NotFoundError('No users found!'); }
        if (isNaN( userId )) { throw new InvalidCredentialsError("User ID must be a number!"); }

        try { await this.userRepository.deleteOneUser(userId); }
        catch (error : any) { throw new NotFoundError(`User with ID '${ userId }' not found!`); }         
    }

    async getAmountOfUsers(): Promise<number> {
        return await this.userRepository.getAmountOfUsers();
    }

    async deleteAllUsers(): Promise<void> {
        if ((await this.getAmountOfUsers()) === 0) {
            throw new NotFoundError('No users found!');
        }
        await this.userRepository.deleteAllUsers();    
    }
}