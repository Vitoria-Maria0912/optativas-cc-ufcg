import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import { UserController } from '../controller/UserController';
import { AuthController } from '../controller/AuthController';
import { isAdministrator } from '../util/util';
import { DisciplineController } from '../controller/DisciplineController';
import { setupSwagger } from "../swagger/swagger";
import { exec } from 'child_process';

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
setupSwagger(app);

const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

const server = app.listen(PORT, () => {
    exec('xdg-open http://localhost:8080/api-docs')
    console.log(`Server is running on port ${PORT}` + '\n' +
                `Swagger in http://localhost:${PORT}/api-docs`);
});

export const closeServer = () => { server.close(); };

const disciplineController = new DisciplineController();
const userController = new UserController();
const authController = new AuthController();

app.use('/protected', (request: Request, response: Response, next) => {
    const authHeader = request.headers.authorization;
    try { 
        if (isAdministrator(authHeader)) { next(); }
    } catch (error: any) { response.status(error.statusCode).json({ error: error.message }); }
});

// User Routes
app.post('/users', (request: Request, response: Response) => {userController.createUser(request,response)});
app.get('/protected/users', (request: Request, response: Response) => {userController.getAllUsers(request, response)});
app.get('/protected/users/getById/:id', (request: Request, response: Response) => {userController.getUserById(request, response)});
app.get('/protected/users/getByEmail/:email', (request: Request, response: Response) => {userController.getUserByEmail(request, response)});
app.get('/protected/users/getByRole/:role', (request: Request, response: Response) => {userController.getUserByRole(request, response)});
app.delete('/protected/users', (request: Request, response: Response) => {userController.deleteAllUsers(request,response)});

// Auth Routes
app.post('/auth/login', (request: Request, response: Response) => {authController.createLogin(request,response)});
app.post('/login/getTokenByUserEmail', (request: Request, response: Response) => {authController.getTokenByUserEmail(request, response)});

// Discipline Routes
app.get('/disciplines', (request: Request, response: Response) => {disciplineController.getAllDisciplines(request,response)});
app.get('/disciplines/getByID/:id', (request: Request, response: Response) => {disciplineController.getOneDisciplineByID(request,response)});
app.get('/disciplines/getByName/:name', (request: Request, response: Response) => {disciplineController.getOneDisciplineByName(request,response)});
app.post('/protected/disciplines', (request: Request, response: Response) => {disciplineController.createDiscipline(request,response)});
app.patch('/protected/disciplines/:id', (request: Request, response: Response) => {disciplineController.patchDiscipline(request,response)});
app.delete('/protected/disciplines/:id', (request: Request, response: Response) => {disciplineController.deleteOneDiscipline(request,response)});
app.delete('/protected/disciplines', (request: Request, response: Response) => {disciplineController.deleteAllDisciplines(request,response)});

// Planning Routes

export default app;

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Create a new login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *     responses:
 *       201:
 *         description: Create a new login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User '${ name }' was created successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/LoginDTO'
 * 
 *       409:
 *         description: Try to create a new login who already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already have a login!"
 * 
 *       400:
 *         description: Try create a login with invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User's ${property.name} is required!"
 * 
 * /login/getTokenByUserEmail:
 *   post:
 *     summary: Returns a token for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginDTO'
 *     responses:
 *       201:
 *         description: Returns a token for a user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User '${ name }' was created successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/LoginDTO'
 * 
 *       404:
 *         description: Try to get a token for a user who does not have a login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User don't have a login!"
 * 
 *       400:
 *         description: Try get a token for a user with invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User's ${property.name} is required!"
 * 
 * /protected/users:
 *   post:
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       201:
 *         description: Create a new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User '${ name }' was created successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 *       409:
 *         description: Try to create a new user who already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User already exists!"
 * 
 *       400:
 *         description: Try create a new user with empty or invalid fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User's ${property.name} is required!"
 * 
 *   delete:
 *     summary: Delete all users
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       200:
 *         description: Delete all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All users were deleted successfully!"
 * 
 *       404:
 *         description: Try to delete all users when there are no users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found!"
 * 
 * /users:
 *   get:
 *     summary: Returns a list of all users
 *     responses:
 *       200:
 *         description: All users were returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users were found successfully!"
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserDTO'
 * 
 *       404:
 *         description: Try to get all users when there are no users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found!"
 *
 * /users/getByID/{id}:
 *   get:
 *     summary: Returns a user by its ID
 *     parameters:
 *       - in: path
 *         id: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User was found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User was found successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 * 
 *       400:
 *         description: Try to get a user by its ID when the ID is not a number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID must be a number!"
 * 
 *       404:
 *         description: Try to get a user by its id that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 *
 * /users/getByEmail/{email}:
 *   get:
 *     summary: Returns a user by its email
 *     parameters:
 *       - in: path
 *         email: email
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User was found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User was found successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 * 
 *       400:
 *         description: Try to get a user by its email when the email is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "This email '${ userEmail }' is invalid, should be like 'name@example.com'!"
 * 
 *       404:
 *         description: Try to get a user by its id that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User with email '${ userEmail }' not found!"
 * 
 * /users/getByRole/{role}:
 *   get:
 *     summary: Returns a user by its role
 *     parameters:
 *       - in: path
 *         role: role
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User was found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User was found successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 * 
 *       400:
 *         description: Try to get a user by its role when the role is invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "The role must be either ADMINISTRATOR or COMMON!"
 * 
 *       404:
 *         description: Try to get a user by its role that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users with '${ userRole }' role found!"
 * 
 * /protected/users/{id}:
 *   patch:
 *     summary: Update a user field
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       200:
 *         description: User's field was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User's field was updated successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 * 
 *       404:
 *         description: Try to update a user that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 * 
 *   put:
 *     summary: Update a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       200:
 *         description: User's was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User's was updated successfully!"
 *                 user:
 *                   $ref: '#/components/schemas/UserDTO'
 * 
 *       404:
 *         description: Try to update a user that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 * 
 *   delete:
 *     summary: Delete a user
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserDTO'
 *     responses:
 *       200:
 *         description: User was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User was deleted successfully!"
 * 
 *       404:
 *         description: Try to delete a user that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found!"
 * 
 * /protected/disciplines:
 *   post:
 *     summary: Create a new discipline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplineDTO'
 *     responses:
 *       201:
 *         description: Create a new discipline
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline created successfully!"
 *                 discipline:
 *                   $ref: '#/components/schemas/DisciplineDTO'
 *       409:
 *         description: Try to create a new discipline who already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline already exists!"
 * 
 *       400:
 *         description: Try create a new discipline with empty fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline's ${property.name} cannot be empty!"
 * 
 *   delete:
 *     summary: Delete all disciplines
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplineDTO'
 *     responses:
 *       200:
 *         description: Delete all disciplines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "All disciplines were deleted successfully!"
 * 
 *       404:
 *         description: Try to delete all disciplines when there are no disciplines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No disciplines found!"
 * 
 * /disciplines:
 *   get:
 *     summary: Returns a list of all disciplines
 *     responses:
 *       200:
 *         description: All disciplines were returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Disciplines were found successfully!"
 *                 disciplines:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DisciplineDTO'
 * 
 *       404:
 *         description: Try to get all disciplines when there are no disciplines
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No disciplines found!"
 *
 * /disciplines/getByID/{id}:
 *   get:
 *     summary: Returns a discipline by its ID
 *     parameters:
 *       - in: path
 *         id: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Discipline was found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline was found successfully!"
 *                 discipline:
 *                   $ref: '#/components/schemas/DisciplineDTO'
 * 
 *       404:
 *         description: Try to get a discipline by its id that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline not found!"
 *
 * /disciplines/getByName/{name}:
 *   get:
 *     summary: Returns a discipline by its name
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discipline was found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline was found successfully!"
 *                 discipline:
 *                   $ref: '#/components/schemas/DisciplineDTO'
 * 
 *       404:
 *         description: Try to get a discipline by its name that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline not found!"
 *
 * /disciplines/getByAcronym/{acronym}:
 *   get:
 *     summary: Returns a discipline by its acronym
 *     parameters:
 *       - in: path
 *         acronym: acronym
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Discipline was found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline was found successfully!"
 *                 discipline:
 *                   $ref: '#/components/schemas/DisciplineDTO'
 * 
 *       404:
 *         description: Try to get a discipline by its acronym that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline not found!"
 *
 * /protected/disciplines/{id}:
 *   patch:
 *     summary: Update a new discipline field
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplineDTO'
 *     responses:
 *       200:
 *         description: Discipline field was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline's field was updated successfully!"
 *                 discipline:
 *                   $ref: '#/components/schemas/DisciplineDTO'
 * 
 *       404:
 *         description: Try to update a discipline that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline not found!"
 * 
 *   put:
 *     summary: Update a discipline
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplineDTO'
 *     responses:
 *       200:
 *         description: Discipline was updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline was updated successfully!"
 *                 discipline:
 *                   $ref: '#/components/schemas/DisciplineDTO'
 * 
 *       404:
 *         description: Try to update a discipline that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline not found!"
 * 
 *   delete:
 *     summary: Delete a discipline
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplineDTO'
 *     responses:
 *       200:
 *         description: Discipline was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline was deleted successfully!"
 * 
 *       404:
 *         description: Try to delete a discipline that does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Discipline not found!"
 * 
 * components:
 *   schemas:
 *     UserDTO:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        role:
 *          type: string
 *        name:
 *          type: string
 *        email:
 *          type: string
 *        password:
 *          type: boolean
 *        planning:
 *          type: array
 *          items:
 *            type: string
 * 
 *     LoginDTO:
 *      type: object
 *      properties:
 *        id:
 *          type: integer
 *        email:
 *          type: string
 *        password:
 *          type: string
 * 
 *     DisciplineDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         type:
 *           type: string
 *         name:
 *           type: string
 *         acronym:
 *           type: string
 *         available:
 *           type: boolean
 *         description:
 *           type: string
 *         pre_requisites:
 *           type: array
 *           items:
 *             type: string
 *         post_requisites:
 *           type: array
 *           items:
 *             type: string
 *         teacher:
 *           type: string
 *         schedule:
 *           type: string
 * 
 *     PeriodDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         disciplines:
 *           type: array
 *           itens:
 *              type: DisciplineDTO
 * 
 *     PlanningDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         periods:
 *           type: array
 *           itens:
 *              type: PeriodDTO
 */