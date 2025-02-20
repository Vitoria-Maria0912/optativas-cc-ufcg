import { IsNotEmpty, IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
// import { Type } from 'class-transformer';
import { PlanningInterface } from "../model/Planning";
import { PeriodInterface } from "../model/Period";
import { PeriodDTO } from './PeriodDTO';
import { Type } from '@prisma/client';

export class PlanningDTO implements PlanningInterface {
    @IsNumber()
    public id: number;

    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsArray()
    @ValidateNested({ each: true })
    public periods: PeriodDTO[];

    constructor(
        id: number,
        name: string,
        periods: PeriodDTO[],
    ) {
        this.id = id;
        this.name = name;
        this.periods = periods;
    }
}