import { RedisOptions } from "ioredis";
import env from "./dotenv";

// Configure Redis connection options
const redisConnection: RedisOptions = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
};

export default redisConnection;
