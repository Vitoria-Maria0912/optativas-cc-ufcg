import express from 'express';
import cors from 'cors';
import { DisciplineController } from '../controller/DisciplineController';
import { setupSwagger } from "../swagger";

export const app = express();
app.use(cors());
app.use(express.json());
setupSwagger(app);

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger in http://localhost:${PORT}/api-docs`);
});

export const closeServer = () => {
    server.close();
};

const disciplineController = new DisciplineController();


/**
 * @swagger
 * /disciplines:
 *   get:
 *     summary: Retorna todas as disciplinas
 *     responses:
 *       200:
 *         description: Lista de disciplinas retornada com sucesso
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
 *     summary: Retorna uma disciplina pelo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Disciplina encontrada com sucesso
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
 *     summary: Retorna uma disciplina pelo nome
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Disciplina encontrada com sucesso
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
 * /protected/disciplines:
 *   post:
 *     summary: Cria uma nova disciplina
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DisciplineDTO'
 *     responses:
 *       201:
 *         description: Disciplina criada com sucesso
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
 * components:
 *   schemas:
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

app.get('/disciplines', (req, res) => {
    disciplineController.getAllDisciplines(req, res);
});
  
app.get('/disciplines/getByID/:id', (req, res) => {
    disciplineController.getOneDisciplineByID(req, res);
});

 app.get('/disciplines/getByName/:name', (req, res) => {
    disciplineController.getOneDisciplineByName(req, res);
});

app.post('/protected/disciplines', (req, res) => {
    disciplineController.createDiscipline(req, res);
});
