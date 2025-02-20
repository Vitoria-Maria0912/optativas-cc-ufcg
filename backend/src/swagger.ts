import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import YAML from 'yamljs';
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
      description: "Documentação da API usando Swagger",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/**/*.ts"], // Certifique-se de que esse caminho inclui seus arquivos de rota
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  const swaggerDocument = YAML.load(path.resolve('src/swagger/swagger.yml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
