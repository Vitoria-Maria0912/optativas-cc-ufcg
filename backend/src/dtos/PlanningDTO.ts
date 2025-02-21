import { IsNotEmpty, IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { PlanningInterface } from "../model/Planning";
import { PeriodDTO } from './PeriodDTO';

export class PlanningDTO implements PlanningInterface {
    @IsNumber()
    public id?: number;

    @IsNumber()
    public userId: number;

    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsArray()
    @ValidateNested({ each: true })
    public periods: PeriodDTO[];

    constructor(
        id: number,
        userId: number,
        name: string,
        periods: PeriodDTO[],
    ) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.periods = periods;
    }
}
