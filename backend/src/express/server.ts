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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "P1"
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
