import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { Role, Type } from "@prisma/client";
import { JWT_SECRET } from "../express/server";
import { UserService } from './../service/UserService';
import { User, UserInterface } from '../model/User';
import { AuthenticationError, DisciplineAlreadyRegisteredError, InvalidCredentialsError, InvalidFieldError, UserAlreadyExistsError, UserNotAuthorizedError } from "../errorHandler/ErrorHandler";
import { Discipline } from '../model/Discipline';
import { isBoolean } from 'class-validator';
import { DisciplineService } from '../service/DisciplineService';

const stringOnlyNumbers = new RegExp('^(?!\\d+$).+');
const stringNumbersAndLetters = new RegExp('^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$')

export const comparePassword = async (password: string, hashPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashPassword);
}

export const isAdministrator = (authHeader: any): boolean => {

    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthenticationError('Access denied, token is missing!');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET) as UserInterface;

        if (decoded.role === Role.ADMINISTRATOR) { return true; }
        else { throw new UserNotAuthorizedError(`Access denied: Administrators only!`) }

    } catch (error: any) {
        if (error instanceof UserNotAuthorizedError || error instanceof InvalidCredentialsError) { throw error; }
        else if (error instanceof jwt.TokenExpiredError) { throw new InvalidCredentialsError('Access denied, token has expired!') }
        else { throw new UserNotAuthorizedError(`Access denied: invalid token!`); }
    }
}

export const validateUserExistence = async (user: User) => {

    const userService = new UserService();
    let existingUser = null;
    try { existingUser = await userService.getUserByEmail(user.email); } catch (error) {}
    if (existingUser) { throw new UserAlreadyExistsError(`This email '${ user.email }' is already in use!`); }
}

export const validateUserFields = async (user: User): Promise<boolean> => {

    if (!user.name) { throw new InvalidCredentialsError('Name is required!'); }

    if (!stringOnlyNumbers.test(user.name)) { throw new InvalidCredentialsError('Name cannot contain only numbers!'); }

    if (user.name.length < 3) { throw new InvalidCredentialsError('Name is too short, should be at least 3 characters!'); }

    if (user.name.length > 50) { throw new InvalidCredentialsError('Name is too long, should be at most 50 characters!'); }

    if (!user.email) { throw new InvalidCredentialsError('Email is required!'); }
    
    if (!user.email.includes('@')) { throw new InvalidCredentialsError(`This email '${user.email}' is invalid, should be like 'name@example.com'!`); }
    
    if (!stringOnlyNumbers.test(user.email)) { throw new InvalidCredentialsError('Email cannot contains only numbers!'); }

    if (user.email.length < 15) { throw new InvalidCredentialsError('Email is too short, should be at least 15 characters!'); }

    if (user.email.length > 50) { throw new InvalidCredentialsError('Email is too long, should be at most 50 characters!'); }

    if (user.role && user.role !== Role.ADMINISTRATOR && user.role !== Role.COMMON) { throw new InvalidCredentialsError('The role must be either ADMINISTRATOR or COMMON!'); }

    return true;
}

export const validateLoginCredentials = async (user: User, email: string, password: string): Promise<boolean> => {

    if (!email) { throw new InvalidCredentialsError('Email is required!'); }

    if (email !== user.email) { throw new InvalidCredentialsError(`This email '${email}' is invalid!`); }

    if (!password) { throw new InvalidCredentialsError('Password is required!'); }

    if (stringNumbersAndLetters.test(password)) { throw new InvalidCredentialsError(`This password '${password}' is invalid, should contains letters and numbers!`); }

    if (password.length < 8) { throw new InvalidCredentialsError('Password is too short, should be at least 8 characters!'); }

    if (password.length > 20) { throw new InvalidCredentialsError('Password is too long, should be at most 20 characters!'); }

    return true;
}

export const validateDisciplineExistence = async (discipline: Discipline) => {

    const disciplineService = new DisciplineService();

    let existingDisciplineName = null;
    let existingDisciplineAcronym = null;

    try { existingDisciplineName = await disciplineService.getOneDisciplineByName(discipline.name); } catch (error) {}
    
    if (existingDisciplineName) { throw new DisciplineAlreadyRegisteredError(`A discipline with this name '${ discipline.name }' already exists!`); }
    
    try { existingDisciplineAcronym = await disciplineService.getOneDisciplineByAcronym(discipline.acronym); } catch (error) {}

    if (existingDisciplineAcronym) { throw new DisciplineAlreadyRegisteredError(`A discipline with this acronym '${ discipline.acronym }' already exists!`); }
}

export const validateDisciplineFields = async (discipline: Discipline): Promise<boolean> => {

    const disciplineService = new DisciplineService();
    let existingDisciplineName = null;

    try { existingDisciplineName = await disciplineService.getOneDisciplineByName(discipline.name); } catch (error) {}

    if (!discipline.name) { throw new InvalidFieldError('Discipline name is required!'); }

    if (!discipline.acronym) { throw new InvalidFieldError('Discipline acronym is required!'); }

    if (discipline.type && discipline.type !== Type.OBRIGATORY && discipline.type !== Type.OPTATIVE) { throw new InvalidFieldError("Discipline's type must be either OBRIGATORY or OPTATIVE!"); }

    if (discipline.available && !isBoolean(discipline.available)) { throw new InvalidFieldError("Discipline's availability must be a boolean!"); }

    if (!stringOnlyNumbers.test(discipline.name)) { throw new InvalidFieldError(`Discipline's name '${discipline.name}' is invalid, should not contains only numbers!`); }

    if (!stringOnlyNumbers.test(discipline.acronym)) { throw new InvalidFieldError(`Discipline's acronym '${discipline.acronym}' is invalid, should not contains only numbers!`); }

    if (discipline.professor && !stringOnlyNumbers.test(discipline.professor)) { throw new InvalidFieldError(`Discipline's professor '${discipline.professor}' is invalid, should not contains only numbers!`); }
    
    if (discipline.description && !stringOnlyNumbers.test(discipline.schedule)) { throw new InvalidFieldError(`Discipline's schedule '${discipline.schedule}' is invalid, should not contains only numbers!`); }

    if (discipline.description && !stringOnlyNumbers.test(discipline.description)) { throw new InvalidFieldError(`Discipline's description '${discipline.description}' is invalid, should not contains only numbers!`); }

    for (const disciplineName of discipline.pre_requisites || []) {
        if (!disciplineName) { throw new InvalidFieldError('A pre requisite cannot be an empty word!'); }
        else if (!existingDisciplineName) { throw new InvalidFieldError(`A pre requisite '${disciplineName}' is invalid, should be a discipline name!`); }
    }
    
    for (const disciplineName of discipline.post_requisites || []) {
        if (!disciplineName) { throw new InvalidFieldError('A post requisite cannot be an empty word!'); }
        else if (!existingDisciplineName) { throw new InvalidFieldError(`A post requisite '${disciplineName}' is invalid, should be a discipline name!`); }
    }

    return true;
}