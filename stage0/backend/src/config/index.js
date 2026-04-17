// import { configDotenv } from "dotenv"
// configDotenv()

export const dbConfig = {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    ssl: process.env.DB_CA_CERT,
    dialect: "mysql"
}