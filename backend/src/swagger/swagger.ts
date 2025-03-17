import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import YAML from 'yamljs';
import path from "path";

export function setupSwagger(app: Express) {
  const swaggerDocument = YAML.load(path.resolve('src/swagger/swagger.yml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
