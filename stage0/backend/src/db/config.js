// import { sequelize } from "./index.js";

// export const dbConn = async () => {
//   try {
//     await sequelize.authenticate();
//     // await sequelize.sync({ alter: true });
//     console.log("Database connected successfully");
//   } catch (err) {
//     console.error("Database connection failed:", err);
//     throw err;
//     // process.exit(1);
//   }
// };

import { sequelize } from "./index.js";

let isConnected = false;

export const dbConn = async () => {
  if (isConnected) return;

  try {
    await sequelize.authenticate();
    isConnected = true;
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
};