import swaggerJsdoc from "swagger-jsdoc";

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management",
      version: "1.0.0",
      description:
        "Assignment 1, assignment to make a Inventory Management form using the Nodejs, TypeScript, Express and MongoDB",
    },
    servers: [
      {
        url:'http://localhost:3001/'
      }
    ]
  },
  apis: ["./src/swagger/*.ts"], 
};

const swaggerSpecs = swaggerJsdoc(options);

export default swaggerSpecs;