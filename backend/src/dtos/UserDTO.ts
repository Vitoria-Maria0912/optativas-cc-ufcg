import { Contains, IsAlphanumeric, IsArray, IsEmail, IsEnum, IsInstance, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";
import { UserInterface } from "../model/User";
import { Role } from "@prisma/client";
import { Login } from "../model/Login";
import { Discipline } from "../model/Discipline";

export class UserDTO implements UserInterface {

    @IsNumber()
    public id: number;

    @IsOptional()
    @IsEnum(Role)
    public role: Role;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    @Length(3, 50, { message: 'Email must be between 15 and 50 characters long!' })
    public name: string;

    @IsNotEmpty()
    @IsInstance(Login)
    public login: Login;

    @IsString()
    @IsNotEmpty()
    @Contains('@')
    @IsEmail()
    @Length(15, 50, { message: 'Email must be between 15 and 50 characters long!' })
    public email: string;

    @IsOptional()
    @IsArray()
    @IsInstance(Discipline, { each: true })
    @IsNotEmpty({ each: true })
    public planning: Discipline[];
    
    constructor(id: number, role: Role, name: string, email: string, login: Login) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.email = email;
        this.login = login;
        this.planning = [];
    }
}