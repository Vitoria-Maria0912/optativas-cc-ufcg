import { Request, Response, NextFunction } from "express";
import { DisciplineController } from '../controller/DisciplineController';
import { PlanningController } from '../controller/PlanningController';
import { setupSwagger } from "../swagger/swagger";
import { UserController } from "../controller/UserController";
import { AuthController } from "../controller/AuthController";
import { AuthenticatedRequest, isAdministrator, verifyTokenMiddleware } from "../util/util";
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';


const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
setupSwagger(app);

const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

const server = app.listen(PORT, () => {
    // exec('xdg-open http://localhost:8080/api-docs')
    console.log(`Server is running on port ${PORT}` + '\n' +
        `Swagger in http://localhost:${PORT}/api-docs`);
});

export const closeServer = () => { server.close(); };

const disciplineController = new DisciplineController();
const planningController = new PlanningController();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

const userController = new UserController();
const authController = new AuthController();

app.use('/protected', (request: Request, response: Response, next) => {
    const authHeader = request.headers.authorization;
    try {
        if (isAdministrator(authHeader)) { next(); }
    } catch (error: any) { response.status(error.statusCode).json({ error: error.message }); }
});

// User Routes
app.post('/users', (request: Request, response: Response) => { userController.createUser(request, response) });
app.get('/protected/users', (request: Request, response: Response) => { userController.getAllUsers(request, response) });
app.get('/protected/users/getById/:id', (request: Request, response: Response) => { userController.getUserById(request, response) });
app.get('/protected/users/getByEmail/:email', (request: Request, response: Response) => { userController.getUserByEmail(request, response) });
app.get('/protected/users/getByRole/:role', (request: Request, response: Response) => { userController.getUserByRole(request, response) });
app.patch('/users/:id', (request: Request, response: Response) => { userController.patchUser(request, response) });
app.delete('/protected/users', (request: Request, response: Response) => { userController.deleteAllUsers(request, response) });
app.delete('/users/:id', (request: Request, response: Response) => { userController.deleteOneUser(request, response) });

// Auth Routes
app.post('/auth/login', (request: Request, response: Response) => { authController.createLogin(request, response) });
app.post('/login/getTokenByUserEmail', (request: Request, response: Response) => { authController.getTokenByUserEmail(request, response) });

// Discipline Routes
app.get('/disciplines', (request: Request, response: Response) => { disciplineController.getAllDisciplines(request, response) });
app.get('/disciplines/getByID/:id', (request: Request, response: Response) => { disciplineController.getOneDisciplineByID(request, response) });
app.get('/disciplines/getByName/:name', (request: Request, response: Response) => { disciplineController.getOneDisciplineByName(request, response) });
app.get('/disciplines/getByAcronym/:acronym', (req, res) => { disciplineController.getOneDisciplineByAcronym(req, res) });
app.post('/protected/disciplines', (request: Request, response: Response) => { disciplineController.createDiscipline(request, response) });
app.patch('/protected/disciplines/:id', (request: Request, response: Response) => { disciplineController.patchDiscipline(request, response) });
app.delete('/protected/disciplines/:id', (request: Request, response: Response) => { disciplineController.deleteOneDiscipline(request, response) });
app.delete('/protected/disciplines', (request: Request, response: Response) => { disciplineController.deleteAllDisciplines(request, response) });

// Planning Routes
app.post("/planning", verifyTokenMiddleware, asyncHandler(
    (req: Request, res: Response, next: NextFunction) => {
        return planningController.createPlanning(req, res);
    }
));

app.put("/planning", asyncHandler(
    (req: Request, res: Response, next: NextFunction) =>
        planningController.updatePlanning(req, res)
));
app.get("/planning", verifyTokenMiddleware, asyncHandler(
    (req: Request, res: Response, next: NextFunction) =>
        planningController.getPlanning(req, res)
));

app.get("/planning/default", asyncHandler(
    (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: "Token não fornecido" });
        }

        try {
            const token = authHeader.split(" ")[1];
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

            req.user = decoded;

            return planningController.getDefaultPlanning(req, res);
        } catch (error: any) {
            return res.status(401).json({ error: "Token inválido ou expirado." });
        }
    }
));

app.get("/planning/:id", asyncHandler(
    (req: Request, res: Response, next: NextFunction) =>
        planningController.getOnePlanning(req, res)
));

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err.stack);

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        error: {
            message: err.message || "Internal server error",
            status: statusCode
        }
    });
};

app.use(errorHandler);

export default app;
