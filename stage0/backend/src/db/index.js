import { Sequelize } from "sequelize";
import { dbConfig } from "../config/index.js";
import fs from "fs";

const sslCa = Buffer.from(dbConfig.ssl, "base64").toString("utf-8");

export const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    ssl: {
        ca: sslCa
    },
    logging: console.log,
    // logging: (...msg) => console.log(msg),
    pool: {
        max: 10,
        min: 1,
        acquire: 30000,
        idle: 10000
    }
});