import { Request, Response } from 'express';
import { DisciplineService, DisciplineServiceInterface } from '../service/DisciplineService';

export class DisciplineController {

    private disciplineService: DisciplineServiceInterface = new DisciplineService();

    async createDiscipline(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const discipline = request.body;
            await this.disciplineService.createDiscipline(discipline);
            responseBody = { message: "Discipline created successfully!", discipline};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to create a discipline!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async getOneDisciplineByID(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { id } = request.params;
            const discipline = await this.disciplineService.getOneDisciplineByID(Number(id));
            responseBody = { message: "Discipline was found successfully!", discipline};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get one discipline!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }
}