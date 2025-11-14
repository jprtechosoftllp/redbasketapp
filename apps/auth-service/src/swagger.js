import swaggerAutogen from "swagger-autogen";

const docs ={
    info: {
        title: "Auth Service API",
        description: "API documentation for the authentication service.",
        version: "1.0.0",
    },
    host: `redbasketapp.hopto.org/auth`, // or your deployed host
    schemes: ["http", 'https'],
}

const outputFile = "./swagger-output.json";
const endpointsFiles = [
     "apps/auth-service/src/routers/index.ts",
    ];

swaggerAutogen()(outputFile, endpointsFiles, docs)