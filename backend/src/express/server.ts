import express from 'express';
import cors from 'cors';

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