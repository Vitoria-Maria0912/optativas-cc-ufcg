import { Contains, IsAlphanumeric, IsArray, IsEmail, IsEnum, IsInstance, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { UserInterface } from "../model/User";
import { Role } from "@prisma/client";
import { Login } from "../model/Login";

export class UserDTO implements UserInterface {

    @IsNumber()
    public id: number;

    @IsOptional()
    @IsEnum(Role)
    public role: Role;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    public name: string;

    @IsNotEmpty()
    @IsInstance(Login)
    public login: Login;

    @IsString()
    @IsNotEmpty()
    @Contains('@')
    @IsEmail()
    public email: string;

    @IsString()
    @IsOptional()
    @IsAlphanumeric()
    public password: string;
    
    constructor(id: number, role: Role, name: string, password:string, email: string, login: Login) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.password = password;
        this.email = email;
        this.login = login;
    }
}