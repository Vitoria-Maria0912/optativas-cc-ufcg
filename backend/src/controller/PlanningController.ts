import { Request, Response } from 'express';
import { DisciplineService, DisciplineServiceInterface } from '../service/DisciplineService';
import { PlanningService, PlanningServiceInterface } from '../service/PlanningService';

interface AuthenticatedRequest extends Request {
    user?: { email: string, role?: string };
}

export class PlanningController {

    private planningService: PlanningServiceInterface = new PlanningService();

    async createPlanning(request: AuthenticatedRequest, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const planning = request.body;
            const userEmail = request.user?.email;
            planning["userEmail"] = userEmail;
            const createdPlanning = await this.planningService.createPlanning(planning);
            responseBody = { message: "Planning created!", createdPlanning};
            codeResponse = 201;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async updatePlanning(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const planning = request.body;
            const updatedPlanning = await this.planningService.updatePlanning(planning);
            responseBody = { message: "Planning updated!", updatedPlanning};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async getPlanning(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const planning = await this.planningService.getPlanning();
            responseBody = { message: "Plannings fetched", planning};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async getDefaultPlanning(request: AuthenticatedRequest, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const userEmail = request.user?.email;
            const planning = await this.planningService.getDefaultPlanning(userEmail || "");
            responseBody = { message: "Plannings fetched", planning};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

    async getOnePlanning(request: Request, response: Response): Promise<Response>  {
        var codeResponse: number;
        var responseBody: object;
        try {
            const { id } = request.params;
            const planning = await this.planningService.getOnePlanning(Number(id));
            responseBody = { message: "Planning fetched", planning};
            codeResponse = 200;
        } catch (error: any) {
            responseBody = { message: (!error.message) ? "Erro no planning!":  error.message};
            codeResponse = error.statusCode && !isNaN(error.statusCode) ? error.statusCode : 400;
        }
        return response.status(codeResponse).json(responseBody)
    }

}