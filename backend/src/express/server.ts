import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { UserController } from '../controller/UserController';

export const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
export const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

const userController = new UserController();

const server = app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`); });

export const closeServer = () => { server.close(); };

app.post('/users', (req, res) => {userController.createUser(req,res)});

export default app;