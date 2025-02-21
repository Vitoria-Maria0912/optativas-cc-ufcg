import { PeriodDTO } from '../dtos/PeriodDTO';
import { Period, PeriodInterface } from './Period';

export interface PlanningInterface {
    id?: number;
    name: string;
    periods: PeriodInterface[];
    userId: number;

}

export class Planning implements PlanningInterface {
    public id?: number;
    public name: string;
    public periods: Period[];
    public userId: number;

    constructor(idOrPlanning: number | PlanningInterface, userId: number, name?: string, periods?: PeriodDTO[]) {
        if (typeof idOrPlanning === "number") {
            this.id = idOrPlanning;
            this.name = name ?? "";
            this.periods = periods ?? [];
            this.userId = userId;
        } else {
            this.id = idOrPlanning.id;
            this.name = idOrPlanning.name;
            this.periods = idOrPlanning.periods.map(period => new Period(period));
            this.userId = userId;
        }
    }
       

}
