import { createClient } from "redis";

export const redisClient = async () => {
  const client = createClient({
    socket: {
      host: "redis",
      rejectUnauthorized: true,
    },
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();
  return client;
};
