import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { UserController } from '../controller/UserController';
import { AuthController } from '../controller/AuthController';
import { isAdministrator } from '../util/util';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
setupSwagger(app);

const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

const userController = new UserController();
const authController = new AuthController();

const server = app.listen(PORT, () => {
    exec('xdg-open http://localhost:8080/api-docs')
    console.log(`Server is running on port ${PORT}` + '\n' +
                `Swagger in http://localhost:${PORT}/api-docs`);
});
const server = app.listen(PORT, () => { console.log(`Server is running on port ${ PORT }`); });

export const closeServer = () => { server.close(); };

app.use('/protected', (request: Request, response: Response, next) => {
    const authHeader = request.headers.authorization;
    try { 
        if (isAdministrator(authHeader)) { next(); }
    } catch (error: any) { response.status(error.statusCode).json({ error: error.message }); }
});

// User Routes
app.post('/users', (request: Request, response: Response) => {userController.createUser(request,response)});
app.get('/protected/users/getById/:id', (request: Request, response: Response) => {userController.getUserById(request, response)});
app.get('/protected/users/getByEmail/:email', (request: Request, response: Response) => {userController.getUserByEmail(request, response)});
app.get('/protected/users/getByRole/:role', (request: Request, response: Response) => {userController.getUserByRole(request, response)});
app.delete('/protected/users', (request: Request, response: Response) => {userController.deleteAllUsers(request,response)});

// Auth Routes
app.post('/auth/login', (request: Request, response: Response) => {authController.createLogin(request,response)});
app.post('/login/getTokenByUserEmail', (request: Request, response: Response) => {authController.getTokenByUserEmail(request, response)});

// Discipline Routes

// Planning Routes

export default app;