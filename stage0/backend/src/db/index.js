import { Sequelize } from "sequelize";
import { dbConfig } from "../config/index.js";

export const sequelize = new Sequelize(dbConfig.name, dbConfig.user, dbConfig.password, {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.ssl,
    // ssl: {
    //     ca: dbConfig.ssl
    // },
    logging: true
});