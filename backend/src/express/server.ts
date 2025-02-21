import express from 'express';
import cors from 'cors';
import { DisciplineController } from '../controller/DisciplineController';
import { setupSwagger } from "../swagger";
import { PlanningController } from '../controller/PlanningController';

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
const planningController = new PlanningController();

setupSwagger(app);

app.get('/disciplines', (req, res) => {disciplineController.getAllDisciplines(req, res)});
app.get('/disciplines/getByID/:id', (req, res) => {disciplineController.getOneDisciplineByID(req, res)});
app.get('/disciplines/getByName/:name', (req, res) => {disciplineController.getOneDisciplineByName(req, res)});
app.post('/protected/disciplines', (req, res) => {disciplineController.createDiscipline(req,res)});
app.patch('/protected/disciplines/:id', (req, res) => {disciplineController.patchDiscipline(req, res)});
app.delete('/protected/disciplines/:id', (req, res) => {disciplineController.deleteOneDiscipline(req, res)});
app.delete('/protected/disciplines', (req, res) => {disciplineController.deleteAllDisciplines(req, res)});

app.post("/planning", (req, res) => {planningController.createPlanning(req, res)})
app.put("/planning", (req, res) => {planningController.updatePlanning(req, res)})
app.get("/planning", (req, res) => {planningController.getPlanning(req, res)})
app.get("/planning/:id", (req, res) => {planningController.getOnePlanning(req, res)})
