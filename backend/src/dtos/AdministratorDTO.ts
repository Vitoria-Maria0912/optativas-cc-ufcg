import { IsAlphanumeric, IsEnum, IsInstance, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Role } from "@prisma/client";
import { Login } from "../model/Login";
import { AdministratorInterface } from "../model/Administrator";

export class AdministratorDTO implements AdministratorInterface {

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
    
    constructor(id: number, role: Role, name: string, login: Login) {
        this.id = id;
        this.role = role;
        this.name = name;
        this.login = login;
    }
}