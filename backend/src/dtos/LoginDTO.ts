import { Contains, IsEmail, IsJWT, IsNotEmpty, IsNumber, IsString, Length } from "class-validator";
import { LoginInterface } from "../model/Login";

export class LoginDTO implements LoginInterface {

    @IsNumber()
    public id : number;

    @IsString()
    @IsNotEmpty()
    @Contains('@')
    @IsEmail()
    @Length(15, 50, { message: 'Email must be between 15 and 50 characters long!' })
    public email : string;

    @IsString()
    @IsNotEmpty()
    @IsJWT()
    @Length(8, 20, { message: 'Password must be between 8 and 20 characters long!' })
    public password : string;

    constructor (id : number, email : string, password : string) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}