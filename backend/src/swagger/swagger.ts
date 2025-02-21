import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import YAML from 'yamljs';
import path from "path";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trilharei",
      version: "1.0.0",
      description: "API do Trilharei",
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Localhost",
      },
    ],
  },
  apis: ["./src/**/*.ts"], 
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express) {
  // app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  const swaggerDocument = YAML.load(path.resolve('src/swagger/swagger.yml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
