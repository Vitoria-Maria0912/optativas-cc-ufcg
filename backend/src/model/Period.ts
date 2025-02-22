import { Discipline, DisciplineInterface } from './Discipline';

export interface PeriodInterface {
    id?: number;
    name: string;
    planningId?: number;
    disciplines: DisciplineInterface[];
}

export class Period implements PeriodInterface {
    public id?: number;
    public name: string;
    public disciplines: Discipline[];
    public planningId?: number; // Agora é opcional

    constructor(period: PeriodInterface);
    constructor(id?: number, name?: string, planningId?: number, disciplines?: Discipline[]);
    constructor(
        idOrPeriod?: number | PeriodInterface,
        name?: string,
        planningId?: number,
        disciplines?: Discipline[]
    ) {
        if (typeof idOrPeriod === "object") {
            // Inicializa a partir de um objeto PeriodInterface
            this.id = idOrPeriod.id;
            this.name = idOrPeriod.name;
            this.planningId = idOrPeriod.planningId;
            this.disciplines = idOrPeriod.disciplines.map(discipline => new Discipline(discipline));
        } else {
            // Inicializa pelos valores individuais, permitindo undefined
            this.id = idOrPeriod;
            this.name = name ?? "";
            this.planningId = planningId; // Se não for passado, será undefined
            this.disciplines = disciplines ?? [];
        }
    }
}

