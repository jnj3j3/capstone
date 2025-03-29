require("dotenv").config();
import swaggerAutogen from "swagger-autogen";
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
swaggerAutogen(outputFile, endpointsFiles, doc);
