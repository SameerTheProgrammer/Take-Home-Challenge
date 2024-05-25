import { config } from "dotenv";
import { cleanEnv, port, str } from "envalid";
import path from "path";

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || "dev"}`),
});

export const env = cleanEnv(process.env, {
    PORT: port(),
    NODE_ENV: str({ default: "dev", choices: ["test", "prod", "dev"] }),
});

export default env;
