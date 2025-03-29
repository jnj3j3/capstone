"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const PORT = process.env.NODE_DOCKER_PORT;
const OUTERIP = process.env.IP;
const doc = {
    info: {
        title: "My API",
        description: "Description",
    },
    host: `${OUTERIP}:${PORT}`,
    schemes: ["http"],
    tags: [
        {
            name: "test",
            description: "test routes",
        },
    ],
    basePath: "",
};
const outputFile = "./swaggerJson.json";
const endpointsFiles = ["./server", "./routes/*"];
(0, swagger_autogen_1.default)(outputFile, endpointsFiles, doc);
//# sourceMappingURL=swagger.js.map