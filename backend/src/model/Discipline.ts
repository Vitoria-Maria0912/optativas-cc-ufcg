import { Type } from '@prisma/client';

export interface DisciplineInterface {
    id: number;
    type: Type;
    name: string;
    acronym: string;
    available: boolean;
    description: string;
    pre_requisites: string[];
    post_requisites: string[];
    teacher: string;
    schedule: string;
}

export class Discipline implements DisciplineInterface {

    public id: number;
    public type: Type;
    public name: string;
    public acronym: string;
    public available: boolean;
    public description: string;
    public pre_requisites: string[];
    public post_requisites: string[];
    public teacher: string;
    public schedule: string;  

    constructor(discipline: DisciplineInterface) {
        this.id = discipline.id;
        this.type = discipline.type;
        this.name = discipline.name;
        this.acronym = discipline.acronym;
        this.available = discipline.available;
        this.description = discipline.description;
        this.pre_requisites = discipline.pre_requisites;
        this.post_requisites = discipline.post_requisites;
        this.teacher = discipline.teacher;
        this.schedule = discipline.schedule;
    }
}