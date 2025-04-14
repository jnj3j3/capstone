import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();
const port = Number(process.env.REDIS_DOCKER_PORT || 6379);

if (isNaN(port)) {
  throw new Error("Invalid REDIS_DOCKER_PORT: not a number");
}
const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: port,
    reconnectStrategy: (retries) => {
      console.error(`Redis reconnect attempt #${retries}`);
      return Math.min(retries * 100, 3000);
    },
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

let isConnected = false;
export const redisClient = async () => {
  if (!isConnected) {
    try {
      await client.connect();
      isConnected = true;
    } catch (err) {
      console.error("Error connecting to Redis", err);
      throw err;
    }
  }
  return client;
};
