import { Discipline } from './Discipline';

export interface PeriodInterface {
    id?: number;
    name: string;
    disciplines: Discipline[];
    planningId?: number;
}

export class Period implements PeriodInterface {

    public id?: number;
    public name: string;
    public disciplines: Discipline[];
    public planningId?: number;

    constructor(period: PeriodInterface) {
        this.id = period.id;
        this.name = period.name;
        this.disciplines = period.disciplines.map(discipline => new Discipline(discipline));
        this.planningId = period.planningId;
    }
}