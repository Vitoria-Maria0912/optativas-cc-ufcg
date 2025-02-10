import express from 'express';
import cors from 'cors';
import { DisciplineController } from '../controller/DisciplineController';

export const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export const closeServer = () => {
    server.close();
};

const disciplineController = new DisciplineController();

app.get('/disciplines', (req, res) => {disciplineController.getAllDisciplines(req, res)});
app.get('/disciplines/getByID/:id', (req, res) => {disciplineController.getOneDisciplineByID(req, res)});
app.post('/protected/disciplines', (req, res) => {disciplineController.createDiscipline(req,res)});