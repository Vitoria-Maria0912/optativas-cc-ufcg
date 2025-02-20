import { Period } from './Period';

export interface PlanningInterface {
    id?: number;
    name: string;
    periods: Period[];
}

export class Planning implements PlanningInterface {

    public id?: number;
    public name: string;
    public periods: Period[];

    constructor(planning: PlanningInterface) {
        this.id = planning.id;
        this.name = planning.name;
        this.periods = planning.periods.map(period => new Period(period));
    }
}
