const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Hospital API",
            version: "1.0.0",
            description: "API documentation for Hospital Management System",
        },
        servers: [
            {
                url: "http://localhost:5000", // Địa chỉ của API
                description: "Local server",
            },
        ],
        components: {
            schemas: {
                User: {
                    type: "object",
                    required: ["username", "email", "password"],
                    properties: {
                        username: {
                            type: "string",
                            description: "The username of the user",
                            example: "mycute",
                        },
                        email: {
                            type: "string",
                            format: "email",
                            description: "The email of the user",
                            example: "mycute@gm.medi.com",
                        },
                        password: {
                            type: "string",
                            format: "password",
                            description: "The password of the user",
                            example: "123456789",
                        },
                    },
                },
            },
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"], // Đường dẫn tới các file chứa chú thích API
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const setupSwagger = (app) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    console.log("Swagger Docs available at http://localhost:5000/api-docs");
};

module.exports = setupSwagger;
