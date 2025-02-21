import { PeriodDTO } from '../dtos/PeriodDTO';
import { Period, PeriodInterface } from './Period';

export interface PlanningInterface {
    id?: number;
    name: string;
    periods: PeriodInterface[];
}


export class Planning implements PlanningInterface {
    public id?: number;
    public name: string;
    public periods: Period[];

    // constructor(planning: PlanningInterface) {
    //     this.id = planning.id;
    //     this.name = planning.name;
    //     this.periods = planning.periods.map(period => new Period(period));
    // }

    constructor(idOrPlanning: number | PlanningInterface, name?: string, periods?: PeriodDTO[]) {
        if (typeof idOrPlanning === "number") {
            // Inicialização pelo ID, name e periods (segundo caso)
            this.id = idOrPlanning;
            this.name = name ?? "";
            this.periods = periods ?? [];
        } else {
            // Inicialização pelo objeto PlanningInterface (primeiro caso)
            this.id = idOrPlanning.id;
            this.name = idOrPlanning.name;
            this.periods = idOrPlanning.periods.map(period => new Period(period));
        }
    }
       

}
