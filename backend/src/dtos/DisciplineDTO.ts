import { Type } from "@prisma/client";
import { DisciplineInterface } from "../model/Discipline";
import { IsNotEmpty, IsString, IsEnum, IsArray, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class DisciplineDTO implements DisciplineInterface {

    @IsNumber()
    public id: number;

    @IsEnum(Type)
    public type: Type;

    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public acronym: string;

    @IsBoolean()
    public available: boolean;

    @IsString()
    @IsOptional()
    public description: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    public pre_requisites: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty({ each: true })
    public post_requisites: string[];

    @IsString()
    public professor: string;

    @IsString()
    public schedule: string;

    constructor(
        id: number,
        type: Type,
        name: string,
        acronym: string,
        available: boolean,
        description: string,
        pre_requisites: string[],
        post_requisites: string[],
        professor: string,
        schedule: string
    ) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.acronym = acronym;
        this.available = available;
        this.description = description;
        this.pre_requisites = pre_requisites;
        this.post_requisites = post_requisites;
        this.professor = professor;
        this.schedule = schedule;
    }
}