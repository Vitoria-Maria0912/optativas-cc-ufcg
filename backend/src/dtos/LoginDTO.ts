import { Contains, IsEmail, IsJWT, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { LoginInterface } from "../model/Login";

export class LoginDTO implements LoginInterface {

    @IsNumber()
    public id : number;

    @IsString()
    @IsNotEmpty()
    @Contains('@')
    @IsEmail()
    public email : string;

    @IsString()
    @IsNotEmpty()
    @IsJWT()
    public password : string;

    constructor (id : number, email : string, password : string) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}