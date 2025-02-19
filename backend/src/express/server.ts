import express from 'express';
import cors from 'cors';
import { DisciplineController } from '../controller/DisciplineController';
import { setupSwagger } from "../swagger/swagger";
import { exec } from 'child_process';

export const app = express();
app.use(cors());
app.use(express.json());
setupSwagger(app);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    exec('xdg-open http://localhost:8080/api-docs')
    console.log(`Server is running on port ${PORT}` + '\n' +
                `Swagger in http://localhost:${PORT}/api-docs`);
});

export const closeServer = () => { server.close(); };

const disciplineController = new DisciplineController();

/**
 * @swagger
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
 */

app.get('/disciplines', (req, res) => {disciplineController.getAllDisciplines(req, res)});
app.get('/disciplines/getByID/:id', (req, res) => {disciplineController.getOneDisciplineByID(req, res)});
app.get('/disciplines/getByName/:name', (req, res) => {disciplineController.getOneDisciplineByName(req, res)});
app.post('/protected/disciplines', (req, res) => {disciplineController.createDiscipline(req,res)});
app.patch('/protected/disciplines/:id', (req, res) => {disciplineController.patchDiscipline(req, res)});
app.delete('/protected/disciplines/:id', (req, res) => {disciplineController.deleteOneDiscipline(req, res)});
app.delete('/protected/disciplines', (req, res) => {disciplineController.deleteAllDisciplines(req, res)});
