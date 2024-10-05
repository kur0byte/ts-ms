import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Hello World',
      version: '1.0.0',
    },
  },
  apis: ['./**/*.ts'], // Updated glob pattern to match .ts files recursively
};

const generateOpenApiSpec = async () => {
  try {
    const openapiSpecification = await swaggerJSDoc(options);
    const docsPath = path.join(__dirname, '../docs');

    if (!fs.existsSync(docsPath)) {
      fs.mkdirSync(docsPath);
    }

    fs.writeFileSync(
      path.join(docsPath, 'openapi.json'),
      JSON.stringify(openapiSpecification, null, 2),
      'utf8'
    );
    console.log('OpenAPI specification has been written to /docs/openapi.json');

    const yamlSpec = yaml.dump(openapiSpecification);
    fs.writeFileSync(path.join(docsPath, 'openapi.yml'), yamlSpec, 'utf8');
    console.log('OpenAPI specification has been written to /docs/openapi.yml');
  } catch (error) {
    console.error('Error generating OpenAPI specification:', error);
  }
};

generateOpenApiSpec();
