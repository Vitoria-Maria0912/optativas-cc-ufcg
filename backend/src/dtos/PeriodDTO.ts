import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { DisciplineInterface } from "../model/Discipline";
import { PeriodInterface } from "../model/Period";

export class PeriodDTO implements PeriodInterface {
    @IsNumber()
    public id: number;

    @IsString()
    @IsNotEmpty()
    public name: string;

    @IsNumber()
    public planningId: number;

    @IsArray()
    @IsNotEmpty({ each: true })
    public disciplines: DisciplineInterface[];

    constructor(
        id: number,
        name: string,
        planningId: number,
        disciplines: DisciplineInterface[]
    ) {
        this.id = id;
        this.name = name;
        this.planningId = planningId;
        this.disciplines = disciplines;
    }
}
