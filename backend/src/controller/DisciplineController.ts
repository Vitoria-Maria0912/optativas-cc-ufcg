import { Request, Response } from 'express';
import { DisciplineService, DisciplineServiceInterface } from '../service/DisciplineService';
import { Type } from '@prisma/client';

export class DisciplineController {

    private disciplineService: DisciplineServiceInterface = new DisciplineService();

    async createDiscipline(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const discipline = { ...request.body, 
                                    type: request.body.type ?? Type.OBRIGATORY, 
                                    available: request.body.available ?? true,
                                    professor: request.body.professor ?? "Not specified",
                                    schedule: request.body.schedule ?? "Not specified",
                                    description: request.body.description ?? ''
            };
            await this.disciplineService.createDiscipline(discipline);
            responseBody = { message: "Discipline created successfully!", discipline};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to create a discipline!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async deleteOneDiscipline(request: Request, response: Response): Promise<Response> {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { id } = request.params;
            await this.disciplineService.deleteOneDiscipline(Number(id));
            responseBody = { message: "Discipline was deleted successfully!"};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to delete a discipline!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async deleteAllDisciplines(request: Request, response: Response): Promise<Response> {
        var codeResponse: number;
        var responseBody: object;
        try {
            await this.disciplineService.deleteAllDisciplines();
            responseBody = { message: "All disciplines were deleted successfully!"};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to delete all disciplines!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async getOneDisciplineByName(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { name } = request.params;
            const discipline = await this.disciplineService.getOneDisciplineByName(name);
            responseBody = { message: "Discipline was found successfully!", discipline};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get one discipline!" : error.message};
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

    async patchDiscipline(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { id } = request.params;
            const updates = request.body;
            await this.disciplineService.patchDiscipline(Number(id), updates);
            const discipline = await this.disciplineService.getOneDisciplineByID(Number(id));
            responseBody = { message: "Discipline's field updated successfully!", discipline};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to update a discipline's field!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async getAllDisciplines(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;

        let page = parseInt(request.query.page as string) || 1;
        let limit = parseInt(request.query.limit as string) || 10;
        
        page = Math.max(page, 1);
        limit = Math.max(limit, 1);
        
        const offset = (page - 1) * limit;

        try {
            const { disciplines, total } = await this.disciplineService.getAllDisciplines(offset, limit);
            responseBody = { message: "Disciplines were found successfully!",
                             disciplines,
                             pagination: {
                                total,
                                page,
                                limit,
                                totalPages: Math.ceil(total / limit)
                            }};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get all disciplines!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async getOneDisciplineByAcronym(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { acronym } = request.params;
            const discipline = await this.disciplineService.getOneDisciplineByAcronym(acronym);
            responseBody = { message: "Discipline was found successfully!", discipline};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Error trying to get one discipline!" : error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }
}