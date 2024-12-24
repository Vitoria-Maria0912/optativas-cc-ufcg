import { IsAlphanumeric, IsEnum, IsInstance, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { UserInterface } from "../model/User";
import { Role } from "@prisma/client";
import { Login } from "../model/Login";

export class UserDTO implements UserInterface {

    @IsNumber()
    public id: number;

    @IsNotEmpty()
    @IsEnum(Role)
    public role: Role;

    @IsString()
    @IsNotEmpty()
    @IsAlphanumeric()
    public name: string;

    @IsNotEmpty()
    @IsInstance(Login)
    public login: Login;
    
    constructor(role: Role, id: number, name: string, login: Login) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.login = login;
    }
}